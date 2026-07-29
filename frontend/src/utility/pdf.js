import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = async (id) => {
    const input = document.getElementById(id);

    if (!input) {
        throw new Error(
            "The fitness plan is not available to download."
        );
    }

    const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
    });

    const image = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const imageWidth = pageWidth - margin * 2;
    const imageHeight =
        (canvas.height * imageWidth) / canvas.width;

    let heightLeft = imageHeight;
    let position = margin;

    pdf.addImage(
        image,
        "PNG",
        margin,
        position,
        imageWidth,
        imageHeight
    );

    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
        position = margin - (imageHeight - heightLeft);

        pdf.addPage();

        pdf.addImage(
            image,
            "PNG",
            margin,
            position,
            imageWidth,
            imageHeight
        );

        heightLeft -= pageHeight - margin * 2;
    }

    pdf.save("FitnessPlan.pdf");
};