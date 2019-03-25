Rate limit
=================

使用Node.js實作流量限制功能並使用Mongodb紀錄每次請求。
  
> **NOTE**: 每個 IP 每分鐘僅能接受 60 個 requests。

開發環境
--------------

  - `docker 18.06.1+`
  - `macOS 10.14.3`

快速啟動
--------------

  載入Node套件
  ```
  npm install
  ```

  啟動Mongodb
  ```
  npm run mongo-up
  ```
  
  啟動程式
  ```
  npm run start
  ```
  
資料庫選擇說明
--------------

流量限制功能的應用場景通常都具有大規模、大流量以及高並發的特性，由於傳統的關係型資料庫在面對大規模、大流量以及高並發時讀寫時性能非常差，無法與NoSql相比，因此選用了NoSQL中的Mongodb。

Mongodb的特性非常適合大數據量處理，相較於Redis、Memcache，Mongodb在可用性以及可靠性上具有優勢，尤其是資料儲存方面非常具有優勢，雖然在性能和運算上的表現Redis、Memcache較佳，但是Mongodb在搭配其他常用功能時具有很大的優勢，例如：

1. 內置資料分析功能。
2. 資料持久化，可進行後續分析。
3. 快速、安全及自動化的實現節點故障轉移。

測試
--------------

  ```
  npm run test
  ```

其他
--------------

  關閉Mongodb
  ```
  npm run mongo-down
  ```