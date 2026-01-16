export interface ResultGetTempletes {
  success: boolean;
  message: string;
  data: TemplateWhatsapp[];
}

export interface TemplateWhatsapp {
  id: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  rejected_reason: string;
  last_updated_time: string;
  components: TemplateComponent[];
}

export type TemplateComponent =
  | HeaderComponent
  | BodyComponent
  | ButtonsComponent;

  export interface HeaderComponent {
  type: "HEADER";
  format: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
  example?: {
    header_handle?: string[];
    header_text?: string[];
  };
}

export interface BodyComponent {
  type: "BODY";
  text: string;
  example?: {
    body_text?: string[][];
  };
}

export interface ButtonsComponent {
  type: "BUTTONS";
  buttons: TemplateButton[];
}

export interface TemplateButton {
  type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
  text: string;
  url?: string;
  phone_number?: string;
}
