import Web3 from 'web3';

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
let web3 = new Web3(Web3.givenProvider);
let state;
// let calcResult = {
//     totalEther: 0,
//     gas: {total: 0, average: 0},
//     uncles: {total: 0},
//     transactions: {
//             sent: [],
//             recevied: [],
//             contractAddresses: [],
//     }   

// };

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
            transactions:[],
            result: {
                totalEther: 0,
                gas: {total: 0, average: 0},
                uncles: {total: 0},
                transactionsProcessed: {
                        sent: [],
                        recevied: [],
                        contractAddresses: []
                }   
            }
        };
        // calcResult = {
        //     totalEther: 0,
        //     gas: {total: 0, average: 0},
        //     uncles: {total: 0},
        //     transactions: {
        //         sent: [],
        //         recevied: []
        //     }   
            
        // };

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
        this.getTotalGasAndAverage();
        this.getUncles();

    }
    processTransactions(){
        // Process the transactions once all have been received
        // Determine all unique sent/received addresses
        // Determine total value for sent/received
        this.getTotalEther();
        this.getAddresses();
    }

    getState(){
        return state;
    }
    
    // *************
    // Block Methods
    // *************
    
    getTotalGasAndAverage(){       
        if(state.blocks.length > 0){
            // Calculate the total and average gas for this query
            
            for(var i=0; i < state.blocks.length; i++){
                state.result.gas.total += state.blocks[i].gasUsed;
            }
            state.result.gas.average = state.result.gas.total / state.blocks.length;
            console.log('Gas: ', state.result.gas);
        } 
    }


    getUncles(){
        for(var i=0; i < state.blocks.length; i++){
            state.result.uncles.total += state.blocks[i].uncles.length;
        }
        console.log('Number uncles: ', state.result.uncles);
    }

    // *******************
    // Transaction Methods
    // *******************
    getTotalEther(){
        for(var i = 0; i < state.transactions.length; i++){
            state.result.totalEther += state.transactions[i].value;
        }
        state.result.totalEther = web3.utils.fromWei(state.result.totalEther);
        console.log('Convert to Ether from Wei', state.result.totalEther);

    }

    getAddresses(){
        
        console.log("Trans count: ", state.transactions.length);
        var sent = state.result.transactionsProcessed.sent;
        var received = state.result.transactionsProcessed.recevied;
        for(var i=0; i < state.transactions.length; i++){
            
            var val = state.transactions[i].value;
           
            var from = {};
            
            var currentFrom = state.transactions[i].from;

            if(currentFrom in sent){
                // Key already exists, update value
                from[currentFrom] += val;

            }else{
                // key doesn't exist, create and set value
                from[currentFrom] = val;
                sent.push(from);

            }
            
            var to = {};     
            var currentTo = state.transactions[i].to; 
            if(currentTo in received){
                // Key already exists, update value                
                to[currentTo] += val;

            }else{
                // key doesn't exist, create and set value                
                to[currentTo] = val;
                received.push(to);

            }
        }
        console.log('*TRANSACTION PROCESSING COMPLETE*: ', state.result.transactionsProcessed);
        this.getContractStatus();
    }
    getContractStatus(){
        var allAddresses = [];

        for(var i = 0; i < state.transactions.length; i++){
            if(state.transactions[i].from in allAddresses)
            {
                // Do nothing, address already captured
            }else{
                var newAddressFrom = {};
                newAddressFrom[state.transactions[i].from] = false;
                allAddresses.push(newAddressFrom);
            }
            if(state.transactions[i].to in allAddresses)
            {
                // Do nothing, address already captured
            }else{
                var newAddressTo = {};
                newAddressTo[state.transactions[i].to] = false;
                allAddresses.push(newAddressTo);
            }
        }
        // Query each address to see which is a contract
        var batch = new web3.eth.BatchRequest();
       
        for(var j = 0; j < allAddresses.length; j++){
            var address = Object.keys(allAddresses[j]).toString();
            // TODO: This needs refactor because the getCode call will only return a result and doesn't appear to be capable to batching.
            // eslint-disable-next-line
            batch.add(web3.eth.getCode.request(address, '', (err, result) => {
                if(err){
                    console.log("Error in getContracts(): ", err);
                }
                if(result === '0x'){
                    // Not a contract address
                }else{
                    state.results.transactionsProcessed.contractAddresses.push(result);
                }
                console.log('getContractStatus result: ', result);
            }));
        } 

        if(batch.requests.length > 0){
            batch.execute();
            console.log('getContracts() batch executed');
        }
    }

}
export default EthHelper;
