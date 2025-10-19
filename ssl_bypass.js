// ssl_bypass.js
const $ = $loon;

console.log("🔧 SSL Bypass 脚本执行");

if ($request) {
    console.log("请求URL:", $request.url);
    console.log("请求方法:", $request.method);
    
    // 记录请求头但不修改
    const headers = $request.headers;
    console.log("请求头:", JSON.stringify(headers, null, 2));
    
    // 如果是账户请求，尝试捕获参数
    if ($request.url.includes('/v3/accounts/') && $request.url.includes('/apps')) {
        console.log("检测到TestFlight账户请求，准备捕获参数");
        
        const session_id = headers['X-Session-Id'];
        const session_digest = headers['X-Session-Digest'];
        const request_id = headers['X-Request-Id'];
        const key = $request.url.match(/\/accounts\/(.*?)\/apps/)?.[1];
        
        if (session_id && session_digest && request_id && key) {
            console.log("成功捕获TestFlight参数");
            $persistentStore.write(session_id, "tf_session_id");
            $persistentStore.write(session_digest, "tf_session_digest");
            $persistentStore.write(request_id, "tf_request_id");
            $persistentStore.write(key, "tf_key");
            $persistentStore.write(Date.now().toString(), "tf_params_timestamp");
            
            $notification.post(
                "✅ TestFlight参数捕获成功",
                "SSL Bypass 工作正常",
                `会话ID: ${session_id.substring(0, 8)}...`
            );
        }
    }
}

// 不修改请求，直接通过
$done({});