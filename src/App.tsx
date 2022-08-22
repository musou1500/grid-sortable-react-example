import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState(
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
    }))
  );

  const [draggingId, setDraggingId] = useState<null | number>(null);
  return (
    <div className="list">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`item ${item.id === draggingId ? "dragging" : ""}`}
          draggable
          onDragStart={() => setDraggingId(item.id)}
          onDrop={() => setDraggingId(null)}
          onDragEnter={(ev) => ev.preventDefault()}
          onDragOver={(ev) => {
            ev.preventDefault();
            const { width } = ev.currentTarget.getBoundingClientRect();
            setItems((prevItems) => {
              if (draggingId === null) {
                return prevItems;
              }

              const destIdx =
                ev.nativeEvent.offsetX < width / 2 ? idx : idx + 1;
              const draggingIdx = prevItems.findIndex(
                ({ id }) => id === draggingId
              );
              if (draggingIdx === -1 || draggingIdx === destIdx) {
                return prevItems;
              } else if (draggingIdx < destIdx) {
                // dragging to the right
                return [
                  ...prevItems.slice(0, draggingIdx),
                  ...prevItems.slice(draggingIdx + 1, destIdx),
                  prevItems[draggingIdx],
                  ...prevItems.slice(destIdx),
                ];
              } else {
                // dragging to the left
                return [
                  ...prevItems.slice(0, destIdx),
                  prevItems[draggingIdx],
                  ...prevItems.slice(destIdx, draggingIdx),
                  ...prevItems.slice(draggingIdx + 1),
                ];
              }
            });
          }}
          onDragEnd={() => setDraggingId(null)}
        >
          {item.id}
        </div>
      ))}
    </div>
  );
}

export default App;
