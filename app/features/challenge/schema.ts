/**
 * 
 * 
 * 
 * Challenges

id (UUID)
challenge_ttl (string)
challenge_ctt (string)
start_date (string)
end_date (string)
max_member_cnt (number)
now_member_cnt (number)
created_at (timestamp)
updated_at (timestamp)
ChallengeMember

id (foreign key to Challenges)
sort_seq (number)
member_id (foreign key to Members)
joined_at (timestamp)
ChallengeSubmits

id (foreign key to Challenges)
sort_seq (number)
member_id (foreign key to Members)
submit_ctt (string)
submited_at (timestamp)

 * 
 */
