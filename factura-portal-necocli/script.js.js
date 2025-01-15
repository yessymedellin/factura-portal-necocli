let invoiceItems = [];
let totalAmount = 0;
let invoiceNumber = 101;

function displayError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
}

function clearError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';
}

function addToInvoice() {
    clearError();

    const serviceDropdown = document.getElementById('service');
    const servicePrice = parseInt(serviceDropdown.value);
    const serviceName = serviceDropdown.options[serviceDropdown.selectedIndex].text;

    const quantity = parseInt(document.getElementById('quantity').value);

    if (!servicePrice || !quantity || quantity <= 0) {
        displayError('Selecciona un servicio y una cantidad válida.');
        return;
    }

    const subtotal = servicePrice * quantity;

    invoiceItems.push({ name: serviceName, price: servicePrice, quantity, subtotal });
    totalAmount += subtotal;
    updateInvoiceTable();
}

function updateInvoiceTable() {
    const tbody = document.querySelector("#invoiceTable tbody");
    tbody.innerHTML = '';

    invoiceItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toLocaleString()}</td>
            <td>$${item.subtotal.toLocaleString()}</td>
            <td><button onclick="removeItem(${index})">Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('totalAmount').textContent = `Total: $${totalAmount.toLocaleString()}`;
}

function removeItem(index) {
    totalAmount -= invoiceItems[index].subtotal;
    invoiceItems.splice(index, 1);
    updateInvoiceTable();
}

function generatePDF() {
    clearError();

    const customerName = document.getElementById('customerName').value;
    const customerRUT = document.getElementById('customerRUT').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;

    if (!customerName || !customerRUT || !customerAddress || !customerPhone || !customerEmail) {
        displayError('Completa todos los campos del cliente.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(15);
    doc.text('Fecha: ' + new Date().toLocaleDateString(), 10, 10);
    doc.text('Portal Necoclí', 10, 20);
    doc.text('Dirección: Necoclí - Calle de la Alcaldía', 10, 30);
    doc.text('Teléfono: 3044554311', 10, 40);
    doc.text('E-mail: portalnecocli@gmail.com', 10, 50);

    const tableBody = invoiceItems.map(item => [
        item.name,
        item.quantity,
        `$${item.price.toLocaleString()}`,
        `$${item.subtotal.toLocaleString()}`
    ]);

    tableBody.push([
        { content: "Total General", colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
        `$${totalAmount.toLocaleString()}`
    ]);

    doc.autoTable({
        startY: 60,
        head: [['Servicio', 'Cantidad', 'Precio Unitario', 'Subtotal']],
        body: tableBody,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [34, 139, 34] }
    });

    doc.setFontSize(15);
    doc.text(`Cliente: ${customerName}`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(`RUT: ${customerRUT}`, 10, doc.lastAutoTable.finalY + 20);
    doc.text(`Dirección: ${customerAddress}`, 10, doc.lastAutoTable.finalY + 30);
    doc.text(`Teléfono: ${customerPhone}`, 10, doc.lastAutoTable.finalY + 40);
    doc.text(`Email: ${customerEmail}`, 10, doc.lastAutoTable.finalY + 50);

    doc.save(`factura_${invoiceNumber}.pdf`);
    invoiceNumber++;
    resetForm();
}

function resetForm() {
    invoiceItems = [];
    totalAmount = 0;
    document.getElementById('invoiceTable').querySelector('tbody').innerHTML = '';
    document.getElementById('totalAmount').textContent = 'Total: $0';
    document.getElementById('customerName').value = '';
    document.getElementById('customerRUT').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('service').value = '';
    document.getElementById('quantity').value = '';
}
