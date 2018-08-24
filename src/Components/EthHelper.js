import Eth from 'web3-eth';

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider );
var state;

class EthHelper{
    
    constructor(){
        
        state = {
            currentBlockNumber: null,
            startBlockNumber: null,
            endBlockNumber: null,
            blocks: []
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
    getBlocksCallback(err, data){
        console.log('Errors: ', err);
        console.log('Data: ', data);
        if(data){
            state.blocks.push(data);
            console.log('block added');
        }
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
            console.log('batch executed');
        }

        if(callback){
            return callback();
        }else{
            return;
        }
    }

    getState(){
        return state;
    }
}
export default EthHelper;
