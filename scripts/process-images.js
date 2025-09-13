const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../src/assets/images');
const outputDir = path.join(__dirname, '../public/images');

// Garantir que o diretório de saída existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Processar imagens
fs.readdirSync(inputDir).forEach((file) => {
  const inputFile = path.join(inputDir, file);
  const outputFileWebP = path.join(outputDir, `${path.parse(file).name}.webp`);
  const outputFileJPEG = path.join(outputDir, `${path.parse(file).name}-optimized.jpeg`);
  const outputFilePNG = path.join(outputDir, `${path.parse(file).name}-optimized.png`);

  // Ignorar arquivos que não são imagens
  if (!['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())) {
    return;
  }

  // Converter para WebP
  sharp(inputFile)
    .webp({ quality: 80 })
    .toFile(outputFileWebP)
    .then(() => console.log(`Imagem processada: ${outputFileWebP}`))
    .catch((err) => console.error(`Erro ao processar ${file}:`, err));

  // Otimizar JPEG
  if (['.jpg', '.jpeg'].includes(path.extname(file).toLowerCase())) {
    sharp(inputFile)
      .jpeg({ quality: 80 })
      .toFile(outputFileJPEG)
      .then(() => console.log(`Imagem JPEG otimizada: ${outputFileJPEG}`))
      .catch((err) => console.error(`Erro ao otimizar ${file}:`, err));
  }

  // Otimizar PNG
  if (path.extname(file).toLowerCase() === '.png') {
    sharp(inputFile)
      .png({ compressionLevel: 9 })
      .toFile(outputFilePNG)
      .then(() => console.log(`Imagem PNG otimizada: ${outputFilePNG}`))
      .catch((err) => console.error(`Erro ao otimizar ${file}:`, err));
  }
});
