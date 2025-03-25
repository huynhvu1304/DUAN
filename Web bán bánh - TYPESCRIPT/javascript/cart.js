document.querySelectorAll(".quantity").forEach(input => {
    input.addEventListener("input", function () {
        let row = this.closest("tr");
        let price = parseInt(row.querySelector(".price").textContent);
        let quantity = parseInt(this.value);
        row.querySelector(".total_price").textContent = price * quantity;
        updateTotal();
    });
});

function updateTotal() {
    let total = 0;
    document.querySelectorAll(".total_price").forEach(cell => {
        total += parseInt(cell.textContent);
    });
    document.getElementById("total_price").textContent = total;
}

document.getElementById("select_all").addEventListener("change", function () {
    let checkboxes = document.querySelectorAll(".select_product");
    checkboxes.forEach(cb => cb.checked = this.checked);
});

document.querySelectorAll(".delete").forEach(button => {
    button.addEventListener("click", function () {
        this.closest("tr").remove();
        updateTotal();
    });
});

updateTotal();