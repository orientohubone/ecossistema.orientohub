// Types for Founder Dashboard

export interface Company {
    id: string;
    name: string;
    plan: 'starter' | 'pro' | 'business' | 'enterprise';
    mrr: number;
    status: 'active' | 'churned' | 'at_risk';
    health_score: number;
    created_at: string;
    last_activity: string;
    user_count?: number;
    features_used?: number;
}

export interface FounderAnalytics {
    revenue: {
        total_mrr: number;
        total_arr: number;
        mrr_growth: number;
        ltv: number;
    };
    customers: {
        active_customers: number;
        new_customers_this_month: number;
        churned_customers: number;
    };
    health: {
        avg_health_score: number;
        healthy_customers: number;
        at_risk_customers: number;
        critical_customers: number;
    };
    engagement: {
        daily_active_users: number;
        weekly_active_users: number;
        monthly_active_users: number;
        avg_session_duration: number;
    };
}

export interface RevenueChartData {
    month: string;
    mrr: number;
    arr: number;
    new_mrr: number;
    churned_mrr: number;
}

export interface ChurnData {
    month: string;
    churned_customers: number;
    churn_rate: number;
    revenue_lost: number;
}

export interface EngagementData {
    metric: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
}

export type MetricType =
    | 'mrr'
    | 'arr'
    | 'ltv'
    | 'churn_rate'
    | 'health_score'
    | 'dau'
    | 'wau'
    | 'mau';

export interface MetricDefinition {
    name: string;
    description: string;
    formula?: string;
    importance: 'critical' | 'high' | 'medium' | 'low';
}
