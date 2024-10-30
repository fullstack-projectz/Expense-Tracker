document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
    const filterCategory = document.getElementById('filter-category');
    const submitButton = document.getElementById('submit-button');

    let expenses = JSON.parse(localStorage.getItem("Expense")) || [];
    let editExpenseId = null;


    const saveExpensesToLocalStorage = () => {
        localStorage.setItem("Expense", JSON.stringify(expenses));
    };


    // function for display the All expenses

    const displayExpenses = (expenseArray) => {
        expenseList.innerHTML = '';

        if (expenseArray.length === 0) {
            const noExpenseRow = document.createElement('tr');
            noExpenseRow.innerHTML = `
                <td colspan="5" style="text-align: center;">No expenses in this category</td>
            `;
            expenseList.appendChild(noExpenseRow);
            return;
        }

        expenseArray.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>`;
            expenseList.appendChild(row);
        });
    };


    // function for update the amount

    const updateTotalAmount = () => {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    };

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        if (editExpenseId) {
            const expenseIndex = expenses.findIndex(exp => exp.id === editExpenseId);
            expenses[expenseIndex] = { id: editExpenseId, name, amount, category, date };
            submitButton.textContent = "Add Expense";
            editExpenseId = null;
        } else {
            const expense = { id: Date.now(), name, amount, category, date };
            expenses.push(expense);
        }

        saveExpensesToLocalStorage();
        displayExpenses(expenses);
        updateTotalAmount();
        expenseForm.reset();
    });


    // Dom Event if user click the add expense
    expenseList.addEventListener("click", (e) => {

        const id = parseInt(e.target.dataset.id);

        if (e.target.classList.contains("delete-btn")) {
            expenses = expenses.filter(expense => expense.id !== id);
            saveExpensesToLocalStorage();
            displayExpenses(expenses);
            updateTotalAmount();
        }

        if (e.target.classList.contains("edit-btn")) {
            const expense = expenses.find(expense => expense.id === id);
            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            submitButton.textContent = "Save Changes";
            editExpenseId = id;
        }
    });


    // Dom event for change event in category selection  
    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === 'All') {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

    // everytime the user come display the expenses
    displayExpenses(expenses);
    updateTotalAmount();
});
