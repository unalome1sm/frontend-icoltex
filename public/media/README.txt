Video del banner (Icoltex)
===========================

Archivos por defecto (orden del carrusel), en esta carpeta:

  public/media/banner/CLIPS PORTADA.mov
  public/media/banner/ICOLTEX27(1).mov
  public/media/banner/ICOLTEX21.mov

Lista editable en: src/config/homeMedia.ts → HOME_BANNER_CLIP_FILES

URLs de prueba en local (codificación automática en el código):

  /media/banner/CLIPS%20PORTADA.mov
  /media/banner/ICOLTEX27(1).mov
  /media/banner/ICOLTEX21.mov

Variables opcionales en frontend/.env:

  NEXT_PUBLIC_BANNER_VIDEO_SRC=https://cdn.../uno.mp4
    → solo un clip (sustituye la lista).

  NEXT_PUBLIC_BANNER_VIDEO_SRCS=/a.mp4,https://cdn/b.mp4
    → varios separados por coma o punto y coma.

Nota: .mov puede fallar en Chrome; MP4 H.264 es más compatible.

---

Sub-banner (dos paneles bajo el carrusel; imagen o video)
Config: src/config/homeMedia.ts → HOME_TWO_PANEL_IMAGES

  public/media/banner/ICOLTEX10(1).mov  (izquierda)
  public/media/banner/ICOLTEX18.mov       (derecha)
