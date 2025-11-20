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

    // Gerar clientSecret fake
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    const mockPaymentIntentId = `pi_mock_${Date.now()}`;

    console.log('✅ [MOCK] PaymentIntent criado:', {
        clientSecret: mockClientSecret,
        paymentIntentId: mockPaymentIntentId,
    });

    return {
        clientSecret: mockClientSecret,
        paymentIntentId: mockPaymentIntentId,
    };
}
