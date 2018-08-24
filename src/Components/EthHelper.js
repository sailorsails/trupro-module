import Eth from 'web3-eth';

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider || 'https://mainnet.infura.io/v3/74f029b29cfd4158bb9c1d55e16bbfe4');
var state;

class EthHelper{
    
    constructor(){
        
        state = {
            currentBlockNumber: null,
            startBlockNumber: null,
            endBlockNumber: null,
            totalUncles: null,
            gasAverage: null,
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
            console.log('End block number is null.  Inferring single type');
            state.endBlockNumber = state.currentBlockNumber;
            state.startBlockNumber = state.endBlockNumber - startBlockVal;
           
        }else{
            console.log('End block number is NOT null.  Inferring range type');
            state.endBlockNumber = endBlockVal;
            state.startBlockNumber = startBlockVal;
        }
        console.log('Start Block Number: ', state.startBlockNumber);
        console.log('End Block Number: ', state.endBlockNumber );
        console.log('Leaving getBlockRange()');
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

    getBlocks(){

        
        console.log('Start Block Number', state.startBlockNumber);
        console.log('End Block Number: ', state.endBlockNumber);
        var count = state.endBlockNumber - state.startBlockNumber || 0;

        var batch = new eth.BatchRequest();
       
        for(var i=0; i < count; i++){
            console.log('Adding block to batch');
            batch.add(eth.getBlock.request(state.endBlockNumber - i, this.getBlocksCallback));
            console.log('Batch: ', batch);
        }
    
        if(batch.requests.length > 0){
            batch.execute();
            console.log('batch execute()');
        }else
            return;
        
    }
    getUncles(){
        state.blocks.forEach(item =>{
            state.totalUncles += item.uncles.length;
        })
    }
    getGasAverage(){
        var total = 0;
        var count = 0;
        state.blocks.forEach(block => {
            count++;
            total += block.gasUsed; 
            console.log('Gas used: ', block.gasUsed);
        });
        state.gasAverage = (total/count) * 100;
    }
    calcTotalEther(){
        
    }

    calcPercentContract(){

    }
    calcUniqueRecords(){

    }

}
export default EthHelper;
