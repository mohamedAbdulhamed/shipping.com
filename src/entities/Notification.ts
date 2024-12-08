type NotificationType = "Alert" | "Message" | "Promotion";

export default interface Notification {
  id: number;
  title: string;
  description: string;
  type: NotificationType;
  unread: boolean;
  date: string;
}
