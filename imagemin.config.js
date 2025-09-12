import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

(async () => {
  const files = await imagemin(['src/assets/images/*.{jpg,png}'], {
    destination: 'dist/assets/images',
    plugins: [
      imageminWebp({ quality: 75 }),
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] })
    ]
  });

  console.log('Images optimized:', files);
})();
