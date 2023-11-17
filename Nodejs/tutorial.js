//Calback Function

// function calculate(x,y,callback){
//     console.log("Calculating")
//     setTimeout(()=>{
//         const sum =  x+y
//         callback(sum)
//     }, 3000)
// }

// function display(result){
//     console.log(`ผลบวก = ${result}`)    
// }

// calculate(100,50, display)

//Create Promise

const connect = true
const url1 = "test1.json" 
function downloading(url){
    return new Promise(function(resolve,reject){
        setTimeout(()=>{
            if(connect){
                resolve(`load ${url} finish`)}
            else{
                reject('error occur')}
        }, 3000)
    })        
}
downloading(url1).then(result=>{
    console.log(result); //Value in resolve
}).catch(err=>{
    console.log(err) 
})
