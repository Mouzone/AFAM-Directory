export const fetcher = ([url, token]: [string, string]) => 
    fetch(url, { 
        headers: { 
            Authorization: `Bearer ${token}` 
        } })
        .then((res) => res.json());
