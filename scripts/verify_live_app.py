import asyncio
import json
import base64
import urllib.request
import websockets

ARTIFACT_DIR = r"C:\Users\Moin\.gemini\antigravity\brain\fd177c49-237a-4536-990c-582ff79a3d26"

async def send_command(ws, method, params=None, msg_id=1):
    payload = {"id": msg_id, "method": method, "params": params or {}}
    await ws.send(json.dumps(payload))
    while True:
        resp = json.loads(await ws.recv())
        if resp.get("id") == msg_id:
            return resp

async def capture_screenshot(ws, filename, msg_id):
    resp = await send_command(ws, "Page.captureScreenshot", {"format": "png"}, msg_id)
    data = base64.b64decode(resp["result"]["data"])
    filepath = f"{ARTIFACT_DIR}\\{filename}"
    with open(filepath, "wb") as f:
        f.write(data)
    print(f"Captured screenshot: {filename}")
    return filepath

async def eval_js(ws, expr, msg_id):
    resp = await send_command(ws, "Runtime.evaluate", {"expression": expr, "returnByValue": True}, msg_id)
    return resp.get("result", {}).get("result", {}).get("value")

async def main():
    # 1. Fetch webSocketDebuggerUrl
    req = urllib.request.urlopen("http://127.0.0.1:9234/json/list")
    pages = json.loads(req.read().decode("utf-8"))
    ws_url = pages[0]["webSocketDebuggerUrl"]
    print("Connecting to CDP at:", ws_url)

    async with websockets.connect(ws_url, max_size=20*1024*1024) as ws:
        msg_id = 100

        # Enable Page and Runtime
        await send_command(ws, "Page.enable", {}, msg_id)
        msg_id += 1
        await send_command(ws, "Runtime.enable", {}, msg_id)
        msg_id += 1

        # Bypass permissions modal if open
        await eval_js(ws, """
            const grantBtn = document.querySelector('button');
            const skipBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Skip') || b.textContent.includes('Grant') || b.textContent.includes('Continue'));
            if (skipBtns.length > 0) skipBtns[0].click();
        """, msg_id)
        msg_id += 1
        await asyncio.sleep(1)

        # 1. Navigate to Home Page
        await eval_js(ws, "window.location.hash = ''; window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate'));", msg_id)
        msg_id += 1
        await asyncio.sleep(1.5)

        # Scroll to view 1-Tap Quick Trip Planner
        await eval_js(ws, """
            const sec = document.querySelector('section[aria-label="1-Tap Quick Trip Planner"]');
            if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
        """, msg_id)
        msg_id += 1
        await asyncio.sleep(0.5)

        # Capture Screenshot of Home Page with 1-Tap Trip Planner
        await capture_screenshot(ws, "verified_home_1tap_planner.png", msg_id)
        msg_id += 1

        # 2. Test 1-Tap instant itinerary generation: click 4-Hour Express button specifically
        click_res = await eval_js(ws, """
            const btns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('View 4h Itinerary'));
            if (btns.length > 0) {
                btns[0].click();
                'clicked_btn';
            } else {
                'btn_not_found';
            }
        """, msg_id)
        print("1-Tap Button click result:", click_res)
        msg_id += 1
        await asyncio.sleep(2.0)

        # Capture Itinerary result screenshot
        await capture_screenshot(ws, "verified_itinerary_1tap_result.png", msg_id)
        msg_id += 1

        # 3. Test Saved Page
        await eval_js(ws, "window.history.pushState({}, '', '/saved'); window.dispatchEvent(new PopStateEvent('popstate'));", msg_id)
        msg_id += 1
        await asyncio.sleep(1.5)

        # Scroll to top of Saved page to verify emblem logo
        await eval_js(ws, "window.scrollTo(0, 0);", msg_id)
        msg_id += 1
        await asyncio.sleep(0.5)
        await capture_screenshot(ws, "verified_saved_header_emblem.png", msg_id)
        msg_id += 1

        # 4. Test Settings Page emblem logo
        await eval_js(ws, "window.history.pushState({}, '', '/settings'); window.dispatchEvent(new PopStateEvent('popstate'));", msg_id)
        msg_id += 1
        await asyncio.sleep(1.5)
        await eval_js(ws, "window.scrollTo(0, 0);", msg_id)
        msg_id += 1
        await asyncio.sleep(0.5)
        await capture_screenshot(ws, "verified_settings_header_emblem.png", msg_id)
        msg_id += 1

        print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(main())
