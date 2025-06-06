// src/app/api/mercadopago_webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/firebaseConfig'; // Importa tu instancia de Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Esta función manejará las solicitudes POST (Mercado Pago enviará notificaciones POST)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Webhook de Mercado Pago recibido:', body);

        // Mercado Pago envía diferentes tipos de notificaciones.
        // La que nos interesa para un pago completado es 'payment'.
        // Los detalles del pago suelen estar en el campo 'data.id' o 'id' para el ID de la operación.
        if (body.type === 'payment' && body.data && body.data.id) {
            const paymentId = body.data.id;

            // Opcional: Puedes hacer una llamada a la API de Mercado Pago para obtener
            // más detalles de este paymentId, incluyendo el estado final (aprobado, pendiente, etc.)
            // y metadata que puedas haber enviado (como userId, resourceId).
            // Para un MVP, podemos asumir que si llega un 'payment' con 'data.id', es relevante.

            // --- Simulación de cómo podrías obtener el resourceId y userId ---
            // En una implementación real, cuando creas el link de Mercado Pago,
            // deberías adjuntar metadatos (ej. 'external_reference' o 'metadata')
            // con el userId y resourceId para poder recuperarlos aquí.
            // Por ahora, como es una simulación, asumiremos valores o los buscaremos
            // en tus documentos de recursos si es necesario.

            // Para este ejemplo, asumiremos que de alguna manera el webhook te da el resourceId y userId.
            // En la vida real, lo pasarías como 'external_reference' al crear la preferencia de MP.
            // Por ejemplo, tu link de Mercado Pago podría tener un patrón o podrías decodificar algo.
            // SIN EMBARGO, para un MVP, vamos a registrar un pago GENÉRICO.
            // Para una solución robusta, necesitarías asociar la compra a un usuario/recurso en el momento de crear el link de MP.

            // Para DEMOSTRAR la funcionalidad, vamos a asumir que:
            // - El 'resourceId' podría ser parte de un campo de metadatos en el webhook.
            // - El 'userId' es el usuario que inició la compra (lo cual es difícil de obtener directamente del webhook sin metadatos).
            // Una forma más simple de empezar es:
            // Cuando el usuario hace clic en "Comprar" en el frontend, podrías hacer una petición a tu propia API
            // que *primero* registre una "compra pendiente" con userId y resourceId, y *luego* lo redirija a Mercado Pago.
            // El webhook de Mercado Pago actualizaría esa "compra pendiente" a "completada".

            // Por ahora, registremos un pago básico para ver si funciona:
            const purchaseRef = doc(db, "purchases", paymentId); // Usar el paymentId como ID del documento de compra
            await setDoc(purchaseRef, {
                paymentId: paymentId,
                status: 'approved', // Asumimos aprobado por simplicidad
                timestamp: new Date(),
                // Más campos como userId, resourceId, price, etc., se añadirían aquí en una implementación completa
                // Por ahora, para que funcione, registraremos un placeholder.
                buyerId: 'placeholder_user_id', // ¡IMPORTANTE: ESTO DEBE VENIR DEL WEBHOOK EN EL FUTURO!
                resourceId: 'placeholder_resource_id', // ¡IMPORTANTE: ESTO DEBE VENIR DEL WEBHOOK EN EL FUTURO!
                // Estos placeholders DEMUESTRAN que la ruta funciona.
                // La conexión real entre usuario-recurso y pago es el siguiente paso.
            }, { merge: true });

            console.log(`Pago ${paymentId} registrado en Firestore.`);

            return NextResponse.json({ message: 'Webhook procesado con éxito', paymentId: paymentId }, { status: 200 });
        }

        return NextResponse.json({ message: 'Tipo de webhook no soportado o datos incompletos' }, { status: 200 });

    } catch (error) {
        console.error('Error al procesar el webhook de Mercado Pago:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// Para Mercado Pago, a veces es útil también tener una función GET para probar el endpoint
export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Mercado Pago Webhook endpoint (GET)' }, { status: 200 });
}
