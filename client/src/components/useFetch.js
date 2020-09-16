import { useEffect } from 'react';

export function useFetchGet() {
    //const [error, setError] = useState(null);
    //const [isLoaded, setIsLoaded] = useState(false);
    //const [items, setItems] = useState([]);
  
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
      fetch("/data")
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            //setIsLoaded(true);
            //setError(error);
            console.log(error);
          }
        )
    }, []);
}
export function useFetchPost(data){
  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    fetch('/', requestOptions)
        .then(response => response.json())
        .then(result => console.log(result));
  
  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [data]);
}
