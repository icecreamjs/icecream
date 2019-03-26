export function getPostFromUser(id) {
  const response = fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then(res => {
      if (res.status !== 200) {
        return;
      }
      return res.json();
    })
    .then(data => data)
    .catch(error => error);

  return response;
}
