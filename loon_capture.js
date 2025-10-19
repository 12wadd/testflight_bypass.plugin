// loon_capture.js
const $ = $loon;

console.log("🎯 TestFlight参数捕获脚本执行");

if ($request && $request.url.includes('/v3/accounts/') && $request.url.includes('/apps')) {
    const url = $request.url;
    const headers = $request.headers;
    
    console.log("捕获TestFlight账户请求");
    
    // 提取关键参数
    const session_id = headers['X-Session-Id'];
    const session_digest = headers['X-Session-Digest'];
    const request_id = headers['X-Request-Id'];
    const key = url.match(/\/accounts\/(.*?)\/apps/)?.[1];
    
    console.log(`参数状态: session_id=${session_id ? "✅" : "❌"}, session_digest=${session_digest ? "✅" : "❌"}, request_id=${request_id ? "✅" : "❌"}, key=${key ? "✅" : "❌"}`);
    
    if (session_id && session_digest && request_id && key) {
        // 存储到持久化存储
        $persistentStore.write(session_id, "tf_session_id");
        $persistentStore.write(session_digest, "tf_session_digest");
        $persistentStore.write(request_id, "tf_request_id");
        $persistentStore.write(key, "tf_key");
        $persistentStore.write(Date.now().toString(), "tf_params_timestamp");
        
        console.log("✅ TestFlight参数保存成功");
        console.log(`Session ID: ${session_id.substring(0, 8)}...`);
        console.log(`Account Key: ${key}`);
        
        $notification.post(
            "✅ TestFlight参数获取成功",
            "Loon插件捕获完成",
            `会话信息已保存\n可以关闭插件了`
        );
        
    } else {
        console.log("❌ 参数不完整，无法保存");
        
        $notification.post(
            "❌ TestFlight参数获取失败",
            "参数不完整",
            `请检查:\n- MITM是否开启\n- 证书是否信任\n- 网络连接状态`
        );
    }
}

$done({});