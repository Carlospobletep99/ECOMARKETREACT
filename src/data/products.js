export const products = [
  {
    codigo: 'P001',
    nombre: 'Manzana Orgánica Certificada',
    descripcion:
      'Manzanas cultivadas sin pesticidas ni fertilizantes químicos. Certificación orgánica SAG. Huella de carbono neutral.',
    fechaVencimiento: '2025-12-15',
    categoria: 'Frutas Orgánicas',
    cantidad: 50,
    precio: 1500,
    unidadMedida: '1 kg',
    imagen: '/images/manzana.png',
    proveedor: { codigoProveedor: 101, nombreProveedor: 'EcoFrutas Orgánicas Chile' }
  },
  {
    codigo: 'P002',
    nombre: 'Palta Hass Biodinámica',
    descripcion:
      'Paltas cultivadas con agricultura biodinámica, sin químicos sintéticos. Certificación Demeter internacional.',
    fechaVencimiento: '2026-03-20',
    categoria: 'Frutas Orgánicas',
    cantidad: 45,
    precio: 2500,
    unidadMedida: '1 kg',
    imagen: '/images/palta.png',
    proveedor: { codigoProveedor: 102, nombreProveedor: 'Biodinámica Verde Ltda' }
  },
  {
    codigo: 'P003',
    nombre: 'Espinaca Baby Hidropónica Ecológica',
    descripcion:
      'Espinacas baby cultivadas en sistema hidropónico cerrado, sin pesticidas. Agua reciclada 100%.',
    fechaVencimiento: '2026-03-15',
    categoria: 'Verduras Ecológicas',
    cantidad: 35,
    precio: 1800,
    unidadMedida: 'Bolsa 250 g',
    imagen: '/images/espinaca.png',
    proveedor: { codigoProveedor: 103, nombreProveedor: 'Hidroponia Sustentable' }
  },
  {
    codigo: 'P004',
    nombre: 'Kale Orgánico Premium',
    descripcion:
      'Súper alimento kale cultivado orgánicamente. Rico en antioxidantes, hierro y vitamina K. Libre de agroquímicos.',
    fechaVencimiento: '2026-03-18',
    categoria: 'Verduras Ecológicas',
    cantidad: 25,
    precio: 2200,
    unidadMedida: 'Atado 300 g',
    imagen: '/images/kale.png',
    proveedor: { codigoProveedor: 104, nombreProveedor: 'SuperVerde Orgánico' }
  },
  {
    codigo: 'P005',
    nombre: 'Quinoa Tricolor Orgánica',
    descripcion:
      'Quinoa orgánica tricolor (blanca, roja, negra) del altiplano andino. Comercio justo y agricultura regenerativa.',
    fechaVencimiento: '2026-08-30',
    categoria: 'Súper Alimentos',
    cantidad: 40,
    precio: 3200,
    unidadMedida: 'Pack 500 g',
    imagen: '/images/quinoa.png',
    proveedor: { codigoProveedor: 105, nombreProveedor: 'Andean Organic Foods' }
  },
  {
    codigo: 'P006',
    nombre: 'Chía Orgánica Premium',
    descripcion:
      'Semillas de chía orgánicas certificadas, rica en omega-3 vegetal. Cultivo sostenible sin irrigación artificial.',
    fechaVencimiento: '2025-12-20',
    categoria: 'Súper Alimentos',
    cantidad: 60,
    precio: 1500,
    unidadMedida: 'Pack 250 g',
    imagen: '/images/chia.png',
    proveedor: { codigoProveedor: 106, nombreProveedor: 'Semillas Ancestrales Eco' }
  },
  {
    codigo: 'P007',
    nombre: 'Leche de Almendras Orgánica',
    descripcion:
      'Bebida vegetal de almendras orgánicas, sin azúcar añadido. Envase 100% reciclable, producción carbono neutral.',
    fechaVencimiento: '2026-04-25',
    categoria: 'Lácteos Vegetales',
    cantidad: 30,
    precio: 1800,
    unidadMedida: 'Botella 1 L',
    imagen: '/images/leche.png',
    proveedor: { codigoProveedor: 107, nombreProveedor: 'PlantMilk Sustentable' }
  },
  {
    codigo: 'P008',
    nombre: 'Queso Vegano de Anacardos',
    descripcion:
      'Queso artesanal vegano elaborado con anacardos orgánicos. Sin lactosa, libre de crueldad animal. Fermentado naturalmente.',
    fechaVencimiento: '2026-04-10',
    categoria: 'Lácteos Vegetales',
    cantidad: 20,
    precio: 3200,
    unidadMedida: 'Unidad 200 g',
    imagen: '/images/queso.png',
    proveedor: { codigoProveedor: 108, nombreProveedor: 'VegCheese Artesanal' }
  },
  {
    codigo: 'P009',
    nombre: 'Miel de Manuka Orgánica',
    descripcion:
      'Miel de manuka certificada orgánica con propiedades antibacterianas. Abejas criadas sin antibióticos ni químicos.',
    fechaVencimiento: '2026-03-15',
    categoria: 'Endulzantes Naturales',
    cantidad: 15,
    precio: 5000,
    unidadMedida: 'Frasco 250 g',
    imagen: '/images/miel.png',
    proveedor: { codigoProveedor: 109, nombreProveedor: 'Miel Pura Patagonia' }
  }
];