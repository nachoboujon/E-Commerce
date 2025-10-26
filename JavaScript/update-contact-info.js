/* =================================================================
   SCRIPT HELPER PARA ACTUALIZAR INFORMACIÓN DE CONTACTO
   Ejecutar en consola del navegador en cualquier página
   ================================================================= */

const NUEVA_INFO = {
    telefono: '3447 416011',
    email: 'info@phonespot.com',
    direccion: 'Moreno 840, CP 3283',
    localidad: 'San José, Entre Ríos',
    horario: 'Lun-Vie 9:00-18:00'
};

// Footer HTML actualizado
const FOOTER_HTML = `
<div class="footer-content">
    <p class="footerText"><i class="fas fa-copyright"></i> PhoneSpot 2025</p>
    <p class="footerText"><i class="fas fa-phone"></i> ${NUEVA_INFO.telefono}</p>
    <p class="footerText"><i class="fas fa-envelope"></i> ${NUEVA_INFO.email}</p>
    <p class="footerText"><i class="fas fa-map-marker-alt"></i> ${NUEVA_INFO.direccion}</p>
    <p class="footerText"><i class="fas fa-location-arrow"></i> ${NUEVA_INFO.localidad}</p>
</div>
`;

console.log('📞 Nueva información de contacto:');
console.log(NUEVA_INFO);
console.log('\n📋 Footer HTML para copiar:');
console.log(FOOTER_HTML);

// Exportar
window.PHONESPOT_INFO = NUEVA_INFO;

