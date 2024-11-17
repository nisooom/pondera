# WXT + React

This template should help get you started developing with React in WXT.

**read journasl page:**

```
chrome-extension://mmoakifgglifjphnjfpgflmacjfhijop/popup.html#/read/2024-03-16
```

```js
// To navigate with props:
navigate(`/read/${date}`);
// or
navigate("/read", { state: { someData: value } });

// In ReadPage component:
import { useParams, useLocation } from "react-router-dom";

const ReadPage = (props) => {
  const { date } = useParams();
  const { state } = useLocation();

  return (
    <div>
      <h1>Reading entry for: {date || props.date}</h1>
      {state?.someData && <p>{state.someData}</p>}
    </div>
  );
};
```
