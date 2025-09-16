const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const path = require('path');
const fs = require('fs');

// Configurações para avatares
const avatarConfig = {
  size: 80, // 80x80px para avatares
  quality: [0.8, 0.9]
};

async function optimizeAvatars() {
  const inputPath = path.join(__dirname, 'src/assets/images');
  const outputPath = path.join(__dirname, 'src/assets/images/avatars');
  
  // Criar pasta de avatars se não existir
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  // Lista dos avatares para otimizar
  const avatarFiles = ['axel.png', 'frajonilda.png', 'misscat.png', 'oliver.png'];
  
  console.log('🎨 Otimizando avatares...');
  
  for (const file of avatarFiles) {
    const inputFile = path.join(inputPath, file);
    
    if (fs.existsSync(inputFile)) {
      try {
        console.log(`📸 Processando ${file}...`);
        
        const files = await imagemin([inputFile], {
          destination: outputPath,
          plugins: [
            imageminPngquant({
              quality: avatarConfig.quality,
              speed: 1
            })
          ]
        });
        
        console.log(`✅ ${file} otimizado com sucesso!`);
        
        // Estatísticas de compressão
        const originalStats = fs.statSync(inputFile);
        const optimizedStats = fs.statSync(path.join(outputPath, file));
        const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
        
        console.log(`   📊 Redução: ${reduction}% (${Math.round(originalStats.size/1024)}KB → ${Math.round(optimizedStats.size/1024)}KB)`);
        
      } catch (error) {
        console.error(`❌ Erro ao processar ${file}:`, error);
      }
    } else {
      console.warn(`⚠️  Arquivo não encontrado: ${file}`);
    }
  }
  
  console.log('🎉 Otimização de avatares concluída!');
}

// Executar otimização
optimizeAvatars().catch(console.error);