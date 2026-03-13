export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface ActionItem {
    category: string;
    description: string;
}

export interface AIFeedback {
    risk_level: string;
    scalability: string;
    maintainability: string;
    high_risks: number;
    insights: string[];
    action_plan: ActionItem[];
}

export interface Decision {
    id: string;
    title: string;
    architecture: string;
    api_design: string;
    data_model: string;
    tech_stack: string;
    tech_choices: string[];
    status: string;
    ai_feedback?: AIFeedback;
    created_at: string;
    updated_at: string;
}

export interface CreateDecisionRequest {
    title: string;
    architecture: string;
    api_design: string;
    data_model: string;
    tech_stack: string;
    tech_choices: string[];
}

export interface Pattern {
    id: string;
    title: string;
    category: string;
    icon: string;
    problem: string;
    solution: string;
    difficulty: string;
    created_at: string;
}

export interface PatternTailoredResponse {
    implementation: string;
    best_practices: string[];
}

export async function listDecisions(): Promise<Decision[]> {
    const response = await fetch(`${API_BASE_URL}/decisions`);
    if (!response.ok) {
        throw new Error("Failed to fetch decisions");
    }
    const data = await response.json();
    return data.decisions || [];
}

export async function getDecision(id: string): Promise<Decision> {
    const response = await fetch(`${API_BASE_URL}/decisions/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch decision");
    }
    return response.json();
}

export async function createDecision(req: CreateDecisionRequest): Promise<Decision> {
    const response = await fetch(`${API_BASE_URL}/decisions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    });
    if (!response.ok) {
        throw new Error("Failed to create decision");
    }
    return response.json();
}

export async function listPatterns(): Promise<Pattern[]> {
    const response = await fetch(`${API_BASE_URL}/patterns`);
    if (!response.ok) {
        throw new Error("Failed to fetch patterns");
    }
    const data = await response.json();
    return data.patterns || [];
}

export async function tailorPattern(patternId: string, techStack: string): Promise<PatternTailoredResponse> {
    const response = await fetch(`${API_BASE_URL}/patterns/tailor`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pattern_id: patternId, tech_stack: techStack }),
    });
    if (!response.ok) {
        throw new Error("Failed to tailor pattern");
    }
    return response.json();
}
