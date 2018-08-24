import Eth from 'web3-eth';

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider);
var state;

class EthHelper{
    
    constructor(){
        
        state = {
            currentBlockNumber: null,
            startBlockNumber: null,
            endBlockNumber: null,
            blocks: [],
            transactions:[]
        }
    }

    getCurrentBlockNumber(callback){        
        eth.getBlockNumber()
            .then((result) => {
                state.currentBlockNumber = result;
                console.log('Current block number: ', state.currentBlockNumber);
                return callback();
            });  
        
    }

    getBlockRange(startBlockVal, endBlockVal, callback){
        
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
       
        return callback();
    }

    getBlocks(callback = null){
        console.log('Start Block Number', state.startBlockNumber);
        console.log('End Block Number: ', state.endBlockNumber);
        var count = state.endBlockNumber - state.startBlockNumber || 0;

        var batch = new eth.BatchRequest();
       
        for(var i=0; i < count; i++){
            console.log('Adding block to batch');
            batch.add(eth.getBlock.request(state.endBlockNumber - i, this.getBlocksCallback));
            
        }
    
        if(batch.requests.length > 0){
            batch.execute();
            console.log('block batch executed');
        }

        if(callback){
            return callback();
        }else{
            return;
        }
    }
    getBlocksCallback(err, result){
        // console.log('Blocks Errors: ', err);
        // console.log('Blocks Data: ', result);
        if(result){
            state.blocks.push(result);
            console.log('block added');
        }
    }
    getTransactions(callback){
        console.log('Inside transactions');
        var batch = new eth.BatchRequest();
        
       
        console.log('*****TRANS: ', state.blocks);
        console.log('*****TRANS length: ', state.blocks.length);
        for(var i=0; i < state.blocks.length; i++){
            console.log('Block # for trans: ', i);
            var tranns = state.blocks[i].transactions;
            for(var j=0; j < tranns.length; j++){
                console.log('Add transactions to batch');
                batch.add(eth.getTransaction.request(tranns[j], this.getTransactionsCallback));
            }
        }
        // blocks.forEach(block => {
        //     var transact = block.transactions;
        //     console.log('Iter block for transactions', transact);
        //     block.transactions.forEach(transaction => {
        //         console.log('Adding block to batch');
        //         console.log(transaction);
        //         //batch.add(eth.getTransaction.request(transaction, this.getBlocksCallback));
        //     });
        // });
        console.log('Trans batch: ', batch.requests);
        if(batch.requests.length > 0){
            batch.execute();
            console.log('transaction batch executed');
        }

        if(callback){
            return callback();
        }else{
            return;
        }
        
    }
    getTransactionsCallback(err, result){
        console.log('Transaction Errors: ', err);
        console.log('Transaction Data: ', result);
        if(result){
            state.transactions.push(result);
            console.log('transaction added');
        }
    }

    getState(){
        return state.blocks;
    }
}
export default EthHelper;
