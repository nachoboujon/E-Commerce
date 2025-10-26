#!/usr/bin/env python3
"""
Script de Ejemplo en Python para PhoneSpot E-Commerce
Demuestra cómo interactuar con el backend desde Python

Requisitos:
    pip install requests python-dotenv
"""

import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración
API_BASE_URL = os.getenv('BACKEND_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@phonespot.com')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')


class PhoneSpotAPI:
    """Cliente de API para PhoneSpot E-Commerce"""
    
    def __init__(self, base_url=API_BASE_URL):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()
    
    def login(self, email, password):
        """Iniciar sesión y obtener token JWT"""
        url = f"{self.base_url}/auth/login"
        payload = {
            "email": email,
            "password": password
        }
        
        try:
            response = self.session.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            self.token = data.get('token')
            
            # Configurar header de autenticación
            self.session.headers.update({
                'Authorization': f'Bearer {self.token}'
            })
            
            print(f"✅ Login exitoso como: {data.get('usuario', {}).get('nombre')}")
            return data
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error en login: {e}")
            return None
    
    def obtener_productos(self, categoria=None):
        """Obtener lista de productos"""
        url = f"{self.base_url}/productos"
        params = {}
        
        if categoria:
            params['categoria'] = categoria
        
        try:
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            productos = data.get('productos', [])
            
            print(f"📦 Productos obtenidos: {len(productos)}")
            return productos
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error al obtener productos: {e}")
            return []
    
    def obtener_ordenes(self, estado=None):
        """Obtener órdenes (requiere permisos de admin)"""
        url = f"{self.base_url}/ordenes"
        params = {}
        
        if estado:
            params['estado'] = estado
        
        try:
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            ordenes = data.get('ordenes', [])
            
            print(f"🛒 Órdenes obtenidas: {len(ordenes)}")
            return ordenes
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error al obtener órdenes: {e}")
            return []
    
    def obtener_estadisticas(self):
        """Obtener estadísticas de ventas (requiere permisos de admin)"""
        url = f"{self.base_url}/ordenes/admin/estadisticas"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            
            data = response.json()
            stats = data.get('estadisticas', {})
            
            print("📊 Estadísticas:")
            print(f"   Total órdenes: {stats.get('totalOrdenes', 0)}")
            print(f"   Pendientes: {stats.get('ordenesPendientes', 0)}")
            print(f"   Entregadas: {stats.get('ordenesEntregadas', 0)}")
            print(f"   Ventas totales: USD ${stats.get('ventasTotales', 0):,.2f}")
            print(f"   Ventas mes: USD ${stats.get('ventasMensuales', 0):,.2f}")
            
            return stats
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error al obtener estadísticas: {e}")
            return {}
    
    def actualizar_stock(self, producto_id, nuevo_stock):
        """Actualizar stock de un producto (requiere permisos de admin)"""
        url = f"{self.base_url}/productos/{producto_id}/stock"
        payload = {
            "stock": nuevo_stock
        }
        
        try:
            response = self.session.patch(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            print(f"✅ Stock actualizado: {producto_id} -> {nuevo_stock}")
            return data
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error al actualizar stock: {e}")
            return None
    
    def actualizar_estado_orden(self, orden_id, nuevo_estado):
        """Actualizar estado de una orden (requiere permisos de admin)"""
        url = f"{self.base_url}/ordenes/{orden_id}/estado"
        payload = {
            "estado": nuevo_estado
        }
        
        estados_validos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']
        
        if nuevo_estado not in estados_validos:
            print(f"❌ Estado inválido. Usa: {', '.join(estados_validos)}")
            return None
        
        try:
            response = self.session.patch(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            print(f"✅ Estado actualizado: {orden_id} -> {nuevo_estado}")
            return data
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error al actualizar estado: {e}")
            return None


# ============================================================
# FUNCIONES DE UTILIDAD
# ============================================================

def generar_reporte_productos(productos):
    """Generar reporte de productos"""
    print("\n" + "="*60)
    print("📊 REPORTE DE PRODUCTOS")
    print("="*60)
    
    # Agrupar por categoría
    categorias = {}
    for p in productos:
        cat = p.get('categoria', 'Sin categoría')
        if cat not in categorias:
            categorias[cat] = []
        categorias[cat].append(p)
    
    # Mostrar resumen
    for categoria, items in categorias.items():
        print(f"\n📦 {categoria}: {len(items)} productos")
        
        stock_total = sum(item.get('stock', 0) for item in items)
        valor_total = sum(item.get('precio', 0) * item.get('stock', 0) for item in items)
        
        print(f"   Stock total: {stock_total} unidades")
        print(f"   Valor inventario: USD ${valor_total:,.2f}")


def generar_reporte_ordenes(ordenes):
    """Generar reporte de órdenes"""
    print("\n" + "="*60)
    print("🛒 REPORTE DE ÓRDENES")
    print("="*60)
    
    # Agrupar por estado
    estados = {}
    for orden in ordenes:
        estado = orden.get('estado', 'desconocido')
        if estado not in estados:
            estados[estado] = []
        estados[estado].append(orden)
    
    # Mostrar resumen
    for estado, items in estados.items():
        print(f"\n📋 {estado.upper()}: {len(items)} órdenes")
        
        total_ventas = sum(item.get('total', 0) for item in items)
        print(f"   Total: USD ${total_ventas:,.2f}")


def exportar_productos_csv(productos, filename='productos_export.csv'):
    """Exportar productos a CSV"""
    import csv
    
    if not productos:
        print("❌ No hay productos para exportar")
        return
    
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            # Obtener todos los campos posibles
            campos = set()
            for p in productos:
                campos.update(p.keys())
            
            campos = sorted(list(campos))
            
            writer = csv.DictWriter(f, fieldnames=campos)
            writer.writeheader()
            writer.writerows(productos)
        
        print(f"✅ Productos exportados a: {filename}")
        
    except Exception as e:
        print(f"❌ Error al exportar: {e}")


# ============================================================
# EJEMPLOS DE USO
# ============================================================

def main():
    """Función principal de demostración"""
    print("🚀 PhoneSpot E-Commerce - Script Python")
    print("="*60)
    
    # Crear cliente de API
    api = PhoneSpotAPI()
    
    # 1. Login como administrador
    print("\n1️⃣ Iniciando sesión como administrador...")
    login_result = api.login(ADMIN_EMAIL, ADMIN_PASSWORD)
    
    if not login_result:
        print("❌ No se pudo iniciar sesión. Verifica las credenciales.")
        return
    
    # 2. Obtener productos
    print("\n2️⃣ Obteniendo productos...")
    productos = api.obtener_productos()
    
    if productos:
        generar_reporte_productos(productos)
        
        # Exportar a CSV (opcional)
        # exportar_productos_csv(productos)
    
    # 3. Obtener órdenes
    print("\n3️⃣ Obteniendo órdenes...")
    ordenes = api.obtener_ordenes()
    
    if ordenes:
        generar_reporte_ordenes(ordenes)
    
    # 4. Obtener estadísticas
    print("\n4️⃣ Obteniendo estadísticas...")
    stats = api.obtener_estadisticas()
    
    # 5. Ejemplo: Actualizar stock de un producto
    # DESCOMENTAR PARA USAR:
    # print("\n5️⃣ Actualizando stock de ejemplo...")
    # api.actualizar_stock('prod-1', 15)
    
    # 6. Ejemplo: Actualizar estado de una orden
    # DESCOMENTAR PARA USAR:
    # if ordenes:
    #     orden_id = ordenes[0].get('_id')
    #     api.actualizar_estado_orden(orden_id, 'procesando')
    
    print("\n" + "="*60)
    print("✅ Script completado")
    print("="*60)


if __name__ == "__main__":
    main()

