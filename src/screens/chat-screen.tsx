import { observer } from "mobx-react-lite";
import { useGrispi } from "@/contexts/grispi-context";
import { useEffect, useState } from "react";

const createWidgetElementIfDoesntExists = () => {
  const widgetEl = document.getElementById("vivollo-chat-widget");

  if (!widgetEl) {
    const widget = document.createElement("div");
    widget.id = "vivollo-chat-widget";
    document.body.appendChild(widget);
  }
}

const removeChatWidget = () => {
  document.getElementById("vivollo-chat-widget")?.remove();
};

export const ChatScreen = observer(() => {
  const { bundle, loading } = useGrispi();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!bundle || loading) return;

    const tenantId = bundle.settings?.['tenant_id'];
    const channelId = bundle.settings?.['channel_id'];

    if (!tenantId || !channelId) {
      removeChatWidget();
      setError("Please contact support to get your tenant ID and channel ID.");
      return;
    }

    const createChatWidget = async () => {
      try {
        createWidgetElementIfDoesntExists();

        await window.Vivollo.create({
          tenantId,
          channelId,
          display: {
            mode: "embedded",
            element: "#vivollo-chat-widget",
          },
        });
      } catch (error: any) {
        if ('message' in error && typeof error.message === 'string') {
          console.error('widget error', { error });

          if (error.message.includes('E3')) {
            return;
          }
        }

        removeChatWidget();
        setError("Error creating chat widget. Please contact support.");
      }
    };

    createChatWidget();
  }, [bundle, loading]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center p-4 text-center h-dvh">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-2xl font-bold text-destructive">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return null;
});
