//fetch data penghubung file json ke html
async function fetchData(){
    try{
    const response = await fetch ('pizza.json');
    if (!response.ok){
    throw new Error('HTTP error! Status: ${response.status}');
    }
    const data = await response.json();
    console.log(data);
    } catch(error) {
    console.error('Could not fetch data:', error.message);
    }
    
    }
    
    fetchData();
