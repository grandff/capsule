-- user_insights 테이블 insert 시 followers_history에 증감값을 upsert(있으면 update, 없으면 insert)로 기록하는 트리거 함수 및 트리거

-- 1. followers_history에 기록하는 함수 생성
CREATE OR REPLACE FUNCTION insert_follower_history_on_user_insights()
RETURNS TRIGGER AS $$
DECLARE
  latest_follower_count INTEGER := 0;
  initial_follower_count INTEGER := 0;
  follower_delta INTEGER;  
BEGIN
  -- followers_count metric만 기록
  IF NEW.metric_name = 'followers_count' THEN
    -- 1. user_insights에서 최신 followers_count 조회 (없으면 0)
    SELECT COALESCE(value, 0) INTO latest_follower_count
    FROM user_insights
    WHERE profile_id = NEW.profile_id
      AND metric_name = 'followers_count'
    ORDER BY created_at DESC
    LIMIT 1;

    -- 2. threads 테이블에서 최초 follower_count 조회 (없으면 0)
    SELECT COALESCE(now_follow_cnt, 0) INTO initial_follower_count
    FROM threads
    WHERE thread_id = NEW.thread_id
    LIMIT 1;

    -- 3. 차이값 계산 (음수 허용)
    follower_delta := latest_follower_count - initial_follower_count;

    -- 4. followers_history에 upsert (동일 profile_id, thread_id, event_type, created_at(날짜) 조합이 있으면 update, 없으면 insert)
    IF EXISTS (
      SELECT 1 FROM followers_history
      WHERE profile_id = NEW.profile_id
        AND thread_id = NEW.thread_id
        AND event_type = 'refresh'        
    ) THEN
      UPDATE followers_history
      SET follower_count = follower_delta,
          created_at = NOW()
      WHERE profile_id = NEW.profile_id
        AND thread_id = NEW.thread_id
        AND event_type = 'refresh';
    ELSE
      INSERT INTO followers_history (
        profile_id,
        thread_id,
        follower_count,
        event_type,
        created_at
      ) VALUES (
        NEW.profile_id,
        NEW.thread_id,
        follower_delta,
        'refresh',
        NOW()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. 기존 트리거가 있으면 삭제
DROP TRIGGER IF EXISTS trigger_insert_follower_history_on_user_insights ON user_insights;

-- 3. user_insights 테이블에 AFTER INSERT 트리거 생성
CREATE TRIGGER trigger_insert_follower_history_on_user_insights
AFTER INSERT ON user_insights
FOR EACH ROW
EXECUTE FUNCTION insert_follower_history_on_user_insights(); 