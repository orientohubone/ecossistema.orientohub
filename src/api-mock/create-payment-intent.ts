/**
 * Mock API - Create Payment Intent
 * 
 * Simula a criação de um PaymentIntent para desenvolvimento local.
 * Use apenas para testar a UI - não processa pagamentos reais.
 */

interface MockPaymentIntentRequest {
    plan: string;
    billing: string;
    email: string;
    name: string;
}

export async function mockCreatePaymentIntent(data: MockPaymentIntentRequest) {
    console.log('🧪 [MOCK] Criando PaymentIntent:', data);

    // Simular delay de rede (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simular possível erro (10% de chance)
    if (Math.random() < 0.1) {
        throw new Error('Erro simulado de rede');
    }

    // Gerar clientSecret no formato válido do Stripe: pi_{id}_secret_{secret}
    const mockId = `1mock${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
    const mockSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const mockClientSecret = `pi_${mockId}_secret_${mockSecret}`;
    const mockPaymentIntentId = `pi_${mockId}`;

    console.log('✅ [MOCK] PaymentIntent criado:', {
        clientSecret: mockClientSecret.substring(0, 30) + '...',
        paymentIntentId: mockPaymentIntentId,
    });

    return {
        clientSecret: mockClientSecret,
        paymentIntentId: mockPaymentIntentId,
    };
}
