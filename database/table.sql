ALTER TABLE `users`
ADD `instructor_experience` VARCHAR(255) NULL DEFAULT NULL AFTER `instructor_subject`,
Go
ADD `instructor_qualifications` VARCHAR(255) NULL DEFAULT NULL AFTER `instructor_experience`;

Go

ALTER TABLE `courses`
ADD `testimonial` TEXT NULL DEFAULT NULL AFTER `short_desc`;

Go

ALTER TABLE `testimonials`
ADD `type` ENUM('student', 'instructor') NULL DEFAULT NULL AFTER `designation`;

Go

ALTER TABLE `testimonials`
CHANGE `type` `type` TEXT CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL;

Go

ALTER TABLE `testimonials`
CHANGE `type` `catagory` ENUM('instructor', 'student') CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL;

Go

ALTER TABLE `testimonials`
CHANGE `catagory` `role` ENUM('instructor', 'student') CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL;

Go

ALTER TABLE `testimonials`
CHANGE `role` `role` ENUM('instructor', 'student') CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT 'instructor';

Go

ALTER TABLE `users`
ADD `studentLevel` VARCHAR(255) NOT NULL AFTER `designation`;

Go

ALTER TABLE `courses`
CHANGE `access_time` `access_time` ENUM(
    'Lifetime',
    'Three Months',
    'Six Months',
    '1 Year',
    'Monthly'
) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT 'Lifetime';

Go

ALTER TABLE `users`
ADD `studentLevel` VARCHAR(255) NOT NULL AFTER `designation`;

Go

ALTER TABLE `courses`
ADD `strip_product_id` VARCHAR(150) NOT NULL AFTER `testimonial`,
ADD `strip_price_id` VARCHAR(150) NOT NULL AFTER `strip_product_id`;

Go

ALTER TABLE `users`
ADD `otp` VARCHAR(100) NOT NULL AFTER `instructor_qualifications`;

ALTER TABLE `users`
CHANGE `instructor_experience` `instructor_experience` FLOAT NULL DEFAULT NULL,
CHANGE `instructor_qualifications` `instructor_qualifications` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
CHANGE `otp` `otp` VARCHAR(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL;

Go

ALTER TABLE `enrolments`
ADD `start_date` VARCHAR(255) NULL DEFAULT NULL AFTER `buyer_name`,
ADD `end_date` VARCHAR(255) NULL DEFAULT NULL AFTER `start_date`;

Go
ALTER TABLE `courses`
CHANGE `access_time` `access_time` ENUM(
    'Lifetime',
    'Three Months',
    'Six Months',
    '1 Year',
    'Monthly'
) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT 'Lifetime';

GO
ALTER TABLE `users`
ADD `session_token` VARCHAR(255) NULL DEFAULT NULL AFTER `otp`;

GO

GO
-- ALTER TABLE `users`
-- ADD `rz_pay_customer_id` VARCHAR(200) NOT NULL AFTER `session_token`;
-- GO

ALTER TABLE `enrolments`
ADD `rz_pay_plan_id` VARCHAR(255) NOT NULL AFTER `updated_at`,
ADD `rz_pay_subscription_id` VARCHAR(255) NOT NULL AFTER `rz_pay_plan_id`,
ADD `rz_pay_subscription_status` VARCHAR(255) NOT NULL AFTER `rz_pay_subscription_id`;