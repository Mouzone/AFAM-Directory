export const fetcher = ([url, token]) => 
    fetch(url, { 
        headers: { 
            Authorization: `Bearer ${token}` 
        } })
        .then((res) => res.json());
