const apiUrl = 'https://crudcrud.com/api/61aad522ba8842ce9f79f1c86f1c0acb/notebooks';

document.addEventListener('DOMContentLoaded', fetchNotebooks);

function addNotebook() {
    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;

    if (title === '' || description === '') {
        alert('Please fill in both fields');
        return;
    }

    const notebook = {
        title,
        description
    };

    axios.post(apiUrl, notebook)
        .then(() => {
            document.querySelector('#title').value = '';
            document.querySelector('#description').value = '';
            fetchNotebooks();
        })
        .catch(error => console.error('Error:', error));
}

function fetchNotebooks() {
    axios.get(apiUrl)
        .then(response => {
            const notebooksDiv = document.querySelector('#notebooks');
            notebooksDiv.innerHTML = '';
            const notebooks = response.data;

            for (let i = 0; i < notebooks.length; i++) {
                const notebook = notebooks[i];
                const notebookItem = document.createElement('div');
                notebookItem.className = 'notebook-item';
                notebookItem.innerHTML = `
                    <span>Title: ${notebook.title}, Description: ${notebook.description}</span>
                    <button onclick="deleteNotebook('${notebook._id}')">Delete</button>
                `;
                notebooksDiv.appendChild(notebookItem);
            }
            updateTotalCount(notebooks.length);
        })
        .catch(error => console.error('Error:', error));
}

function deleteNotebook(id) {
    axios.delete(`${apiUrl}/${id}`)
        .then(() => fetchNotebooks())
        .catch(error => console.error('Error:', error));
}

function searchNotebooks() {
    const searchValue = document.getElementById('search').value.toLowerCase();

    axios.get(apiUrl)
        .then(response => {
            const notebooksDiv = document.getElementById('notebooks');
            notebooksDiv.innerHTML = '';

            const filteredNotebooks = response.data.filter(notebook =>
                notebook.title.toLowerCase().includes(searchValue) ||
                notebook.description.toLowerCase().includes(searchValue)
            );

            for (let i = 0; i < filteredNotebooks.length; i++) {
                const notebook = filteredNotebooks[i];
                const notebookItem = document.createElement('div');
                notebookItem.className = 'notebook-item';
                notebookItem.innerHTML = `
                    <span>Title: ${notebook.title}, Description: ${notebook.description}</span>
                    <button onclick="deleteNotebook('${notebook._id}')">Delete</button>
                `;
                notebooksDiv.appendChild(notebookItem);
            }
            updateTotalCount(filteredNotebooks.length);
        })
        .catch(error => console.error('Error:', error));
}

function updateTotalCount(count) {
    document.getElementById('total-count').textContent = count;
}
