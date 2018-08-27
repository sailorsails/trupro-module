import Web3 from 'web3';

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
let web3 = new Web3(Web3.givenProvider);
let state = {
    currentBlockNumber: null,
    startBlockNumber: null,
    endBlockNumber: null,
    blockBatchCount: 0,
    transactionBatchCount: 0,
    blocks: [],
    transactions:[],
};
let calcResult = {
    totalEther: 0,
    gas: {total: 0, average: 0},
    uncles: {total: 0},
    transactions: {
            sent: [{addres: '', total: 0}],
            recevied: [{address: '', total: 0}]
    }   

};

class EthHelper{

    getBlocksAndTransactions(start, end, callback = null){
        // Reset the state
        state = {
            currentBlockNumber: null,
            startBlockNumber: null,
            endBlockNumber: null,
            blockBatchCount: 0,
            transactionBatchCount: 0,
            blocks: [],
            transactions:[]
        };
        calcResult = {
            totalEther: 0,
            gas: {total: 0, average: 0},
            uncles: {total: 0},
            transactions: {
                sent: [{addres: '', total: 0}],
                recevied: [{address: '', total: 0}]
            }   
            
        };

        this.getCurrentBlockNumber(() => {
            this.getBlockRange(start, end, () => {
                this.getBlocks();
            });
        });
        
        if(callback){
            return callback();
        }
    }

    getCurrentBlockNumber(callback=null){        
        web3.eth.getBlockNumber()
            .then((result) => {
                state.currentBlockNumber = result;
                console.log('Current block number: ', state.currentBlockNumber);
                return callback();
            });  
        
    }

    getBlockRange(startBlockVal, endBlockVal, callback=null){
        
        if(startBlockVal === null && endBlockVal === null){
            // If no values, return.
            return;
        }
        // If the end block is empty, we can infer that the search type 
        // was a single number and the end block will be the currentBlock
        if(endBlockVal === null || endBlockVal === ''){
            
            state.endBlockNumber = state.currentBlockNumber;
            state.startBlockNumber = state.endBlockNumber - startBlockVal;
           
        }else{
            
            state.endBlockNumber = endBlockVal;
            state.startBlockNumber = startBlockVal;
        }
       
        if(callback){
            return callback();
        }else{
            return;
        }
    }

    getBlocks(callback = null){
        console.log('Start Block Number', state.startBlockNumber);
        console.log('End Block Number: ', state.endBlockNumber);
        var count = state.endBlockNumber - state.startBlockNumber || 0;

        var batch = new web3.eth.BatchRequest();
       
        for(var i=0; i < count; i++){
            console.log('Adding block to batch');
            // eslint-disable-next-line
            batch.add(web3.eth.getBlock.request(state.endBlockNumber - i, (err,result) => {
                if(result){
                    state.blocks.push(result);
                    console.log('block added');
                    state.blockBatchCount--;
                }
                if(state.blockBatchCount === 0 && state.blocks.length > 0){
                    // We have received all of the batch, and can process the transactions.
                    console.log('Received Blocks: ', state.blocks);
                    console.log('Ready for transactions');
                    this.getTransactions();
                }
            }));
            
            state.blockBatchCount++;
        }
    
        if(batch.requests.length > 0){
            batch.execute();
            console.log('block batch executed');
        }

    }
    
    getTransactions = () =>{
        var batch = new web3.eth.BatchRequest();
        console.log('blocks length****: ', state.blocks.length);
        console.log('Blocks: ', state.blocks);
        
        for(var i=0; i < state.blocks.length; i++){
            var trans = state.blocks[i].transactions;
            for(var j=0; j < trans.length; j++){
                console.log('Add transactions to batch');
                // eslint-disable-next-line
                batch.add(web3.eth.getTransaction.request(trans[j], (err, result) => {
                    
                    if(result){
                        state.transactions.push(result);
                        console.log('transaction added');
                        state.transactionBatchCount--;

                        // Need to track the callbacks from the transaction batch
                        // we have the increment of the transaction batch counter in the state
                        // We can reduce that value as the results arrive and are pushed into the state.
                        if(state.transactionBatchCount === 0){
                            // We have received all of the transactions and can continue any other sequence code
                            console.log('****All transactions received****', state.transactions);
                            this.processBlocks();
                            this.processTransactions();
                        }
                    }
                }));
                state.transactionBatchCount++;
            }
        }
        
        if(batch.requests.length > 0){
            batch.execute();
            console.log('transaction batch executed');
        }
    }
    
    processBlocks(){
        // Process all blocks once they have been received
        this.calcGas();
        this.calcUncles();

    }
    processTransactions(){
        // Process the transactions once all have been received
        // Determine all unique sent/received addresses
        // Determine total value for sent/received
        this.calcTotalEther();
        this.calcAddresses();
    }

    getState(){
        return state;
    }
    
    // *************
    // Block Methods
    // *************
    
    calcGas(){       
        if(state.blocks.length > 0){
            // Calculate the total and average gas for this query
            
            for(var i=0; i < state.blocks.length; i++){
                calcResult.gas.total += state.blocks[i].gasUsed;
            }
            calcResult.gas.average = calcResult.gas.total / state.blocks.length;
            console.log('Gas: ', calcResult.gas);
        } 
    }


    calcUncles(){
        for(var i=0; i < state.blocks.length; i++){
            calcResult.uncles.total += state.blocks[i].uncles.length;
        }
        console.log('Number uncles: ', calcResult.uncles);
    }

    // *******************
    // Transaction Methods
    // *******************
    calcTotalEther(){
        for(var i = 0; i < state.transactions.length; i++){
            calcResult.totalEther += state.transactions[i].value;
        }
        calcResult.totalEther = web3.utils.fromWei(calcResult.totalEther);
        console.log('Convert to Ether from Wei', calcResult.totalEther);

    }

    calcAddresses(){
        
        console.log("Trans count: ", state.transactions.length);
        var sent = calcResult.transactions.sent;
        var rec = calcResult.transactions.recevied;
        for(var i=0; i < state.transactions.length; i++){
            
            var val = state.transactions[i].value;
            
            var fromRecord = {address: state.transactions[i].from, total: val};
            var toRecord = {address: state.transactions[i].to, total: val};
            
            sent.push(fromRecord);
            rec.push(toRecord);
        }
        console.log('*TRANSACTIONS*: ', calcResult.transactions);
    }
    

    
    
    calcReceivedAddressUnique(){
        for(var i= 0; i < calcResult.address; i++){

        }
    }

    calcSentAddressUnique(){
        for(var i= 0; i < calcResult.address; i++){
                    
        }
    }

}
export default EthHelper;
