document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('passwordForm');
    const passwordList = document.getElementById('passwordList');
    
    //simple functions to prevent basic XSS attacks
    const escapeHTML = (str) =>{
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    //FOR GETTING PASSWORDS
    const getPasswords = () => {
        // Get passwords from localStorage or return an empty array
        return JSON.parse(localStorage.getItem('passwords')) || [];
    };

    //FOR DISPLAYING PASSWORDS
    const displayPasswords = () => {
        const passwords = getPasswords();
        passwordList.innerHTML = "";
        
        //case where no passwords are saved yet
        if (passwords.length === 0) {
            passwordList.innerHTML = '<tr><td colspan="4" style="text-align:center;">No passwords saved yet.</td></tr>';
            return;
        }

        //new row for every new entry of passwords
        passwords.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
            <td>${escapeHTML(entry.website)}</td>
                        <td>${escapeHTML(entry.username)}</td>
                        <td class="password-cell" data-password="${escapeHTML(entry.password)}">********</td>
                        <td>
                            <button class="action-btn toggle-btn" data-index="${index}">Show</button>
                            <button class="action-btn delete-btn" data-index="${index}">Delete</button>
                        </td>
                        `;
            passwordList.appendChild(row);
        });
    };

    //SAVING A NEW PASSOWORD ON SUBMIT CLICK
    form.addEventListener('submit', (e) => {
        //By default, when you click the submit button on an HTML form, the browser's action is to gather the form data and reload the page to send that data to a server.In our password manager, we don't want the page to reload. We want the page to stay as it is, grab the input values with JavaScript, save them to localStorage, and update the table—all without a disruptive refresh.
        e.preventDefault();

        const website = document.getElementById('website').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwords = getPasswords();
        passwords.push({ website, username, password });

        localStorage.setItem('passwords', JSON.stringify(passwords));

        form.reset();
        displayPasswords();
    });

    //show-hide (toggle feature)
    passwordList.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.dataset.index;

        if (target.classList.contains('toggle-btn')) {
            const passwordCell = target.parentElement.previousElementSibling;
            const realPassword = passwordCell.getAttribute('data-password');

            if (target.textContent === 'Show') {
                passwordCell.textContent = realPassword;
                target.textContent = 'Hide';
            } else {
                passwordCell.textContent = '********';
                target.textContent = 'Show';
            }
        }
        if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this password?')) {
                const passwords = getPasswords();
                //removes the entry
                passwords.splice(index, 1);
                localStorage.setItem('passwords', JSON.stringify(passwords));
                displayPasswords();
            }
        }
    });


    //initial load
    displayPasswords();
});
