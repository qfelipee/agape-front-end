    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";
    import * as XLSX from "xlsx";

    export function exportarExcel(dados, colunas, nomeArquivo) {
    const linhas = dados.map((item) => {
        const linha = {};
        colunas.forEach((col) => {
        linha[col.titulo] = col.valor(item);
        });
        return linha;
    });

    const worksheet = XLSX.utils.json_to_sheet(linhas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    XLSX.writeFile(workbook, `${nomeArquivo}.xlsx`);
    }

    export function exportarPDF(dados, colunas, nomeArquivo, titulo) {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(titulo, 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, 24);

    const head = [colunas.map((c) => c.titulo)];
    const body = dados.map((item) => colunas.map((c) => c.valor(item)));

    autoTable(doc, {
        head,
        body,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [245, 166, 35], textColor: [26, 26, 26] },
    });

    doc.save(`${nomeArquivo}.pdf`);
    }
    