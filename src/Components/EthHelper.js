import Eth from 'web3-eth';

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
let eth = new Eth(Eth.givenProvider);
let state = {
    currentBlockNumber: null,
    startBlockNumber: null,
    endBlockNumber: null,
    blockBatchCount: 0,
    transactionBatchCount: 0,
    blocks: [],
    transactions:[],
}

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
        }

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
        eth.getBlockNumber()
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

        var batch = new eth.BatchRequest();
       
        for(var i=0; i < count; i++){
            console.log('Adding block to batch');
            // eslint-disable-next-line
            batch.add(eth.getBlock.request(state.endBlockNumber - i, (err,result) => {
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
        console.log('Inside transactions');
        var batch = new eth.BatchRequest();
        console.log('blocks length****: ', state.blocks.length);
        console.log('Blocks: ', state.blocks);
        
        for(var i=0; i < state.blocks.length; i++){
            
            var trans = state.blocks[i].transactions;
            for(var j=0; j < trans.length; j++){
                console.log('Add transactions to batch');
                // eslint-disable-next-line
                batch.add(eth.getTransaction.request(trans[j], (err, result) => {
                    
                    if(result){
                        state.transactions.push(result);
                        console.log('transaction added');
                        state.transactionBatchCount--;

                        // Need to track the callbacks from the transaction batch
                        // we have the increment of the transaction batch counter in the state
                        // We can reduce that value as the results arrive and are pushed into the state.
                        if(state.transactionBatchCount === 0){
                            // We have received all of the transactions and can continue any other sequence code
                            console.log('****All transactions received****');
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

    }
    processTransactions(){

    }

    getState(){
        return state;
    }
    // getUncles(){
    //     state.blocks.forEach(item =>{
    //         state.totalUncles += item.uncles.length;
    //     })
    // }
    // getGasAverage(){
    //     var total = 0;
    //     var count = 0;
    //     state.blocks.forEach(block => {
    //         count++;
    //         total += block.gasUsed; 
    //         console.log('Gas used: ', block.gasUsed);
    //     });
    //     state.gasAverage = (total/count) * 100;
    // }
    // calcTotalEther(){
        
    // }

    // calcPercentContract(){

    // }
    // calcUniqueRecords(){

    // } 

}
export default EthHelper;
