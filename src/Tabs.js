import { useId, useState, useRef, useEffect } from "react";

function getTabListItemId(tabsId, value) {
  return tabsId + "-tab-" + value;
}

function getTabPanelId(tabsId, value) {
  return tabsId + "-tabpanel-" + value;
}

export default function Tabs({ defaultValue, items }) {
  const tabsId = useId();
  const [value, setValue] = useState(defaultValue ?? items[0].value);

  // Ref to track buttons for manual focus management
  const tabRefs = useRef(new Map());

  // Move focus whenever the value changes (Automatic Activation)
  useEffect(() => {
    const activeTabNode = tabRefs.current.get(value);
    if (activeTabNode) {
      activeTabNode.focus();
    }
  }, [value]);

  const handleKeyDown = (event, currentIndex) => {
    let nextIndex;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = items.length - 1;
        break;
      default:
        return; // Exit for other keys
    }

    event.preventDefault();
    setValue(items[nextIndex].value);
  };

  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
        {items.map(({ label, value: itemValue }, index) => {
          const isActiveValue = itemValue === value;

          return (
            <button
              ref={(node) => {
                if (node) tabRefs.current.set(itemValue, node);
                else tabRefs.current.delete(itemValue);
              }}
              id={getTabListItemId(tabsId, itemValue)}
              key={itemValue}
              type="button"
              role="tab"
              // Tab key logic: Only the active tab is reachable via Tab
              tabIndex={isActiveValue ? 0 : -1}
              aria-selected={isActiveValue}
              aria-controls={getTabPanelId(tabsId, itemValue)}
              className={[
                "tabs-list-item",
                isActiveValue && "tabs-list-item--active",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setValue(itemValue)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div>
        {items.map(({ panel, value: itemValue }) => (
          <div
            key={itemValue}
            id={getTabPanelId(tabsId, itemValue)}
            role="tabpanel"
            aria-labelledby={getTabListItemId(tabsId, itemValue)}
            hidden={itemValue !== value}
            // Ensure panel is next in tab sequence
            tabIndex={0}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
