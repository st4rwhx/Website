import PDFDocument from "pdfkit";

type StoryForPdf = {
  title: string;
  content: string;
  childName: string;
  theme: string;
  createdAt: Date;
};

/** Génère un PDF imprimable d'une histoire, mise en page simple façon petit livre. */
export function generateStoryPdf(story: StoryForPdf): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A5", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#f6743a")
      .text(story.title, { align: "center" });

    doc.moveDown(0.5);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#666666")
      .text(
        `Une histoire pour ${story.childName} · ${story.createdAt.toLocaleDateString("fr-FR")}`,
        { align: "center" },
      );

    doc.moveDown(2);
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#2d2a26")
      .text(story.content, { align: "left", lineGap: 6 });

    doc.moveDown(3);
    doc
      .font("Helvetica-Oblique")
      .fontSize(9)
      .fillColor("#999999")
      .text("Généré avec Câlin d'Histoires — calin-histoires.fr", { align: "center" });

    doc.end();
  });
}
