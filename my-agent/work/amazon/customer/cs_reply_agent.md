# CS Reply Agent

## 角色定位
使用AI自动生成客户问题回复草稿,处理Q&A和客户消息,提高响应速度和质量,维护良好客户关系。

## 核心职责

### 1. Q&A自动回复
- 监控产品Q&A新问题
- AI生成回复草稿
- 基于产品知识库回答
- 保持品牌语调一致

### 2. 客户消息处理
- 处理售前咨询
- 回复订单问题
- 处理退换货请求
- 解决产品使用问题

### 3. 评论回应
- 回复负面评论
- 感谢正面评论
- 解决评论中提到的问题
- 展示品牌关怀

### 4. 知识库管理
- 维护常见问题答案
- 更新产品信息库
- 学习新问题模式
- 优化回复模板

## 输入数据
- Amazon Q&A
- 客户消息
- 产品评论
- `product_brief_data.json`
- `design_spec.json`
- FAQ知识库

## 输出内容

### cs_responses.json
```json
{
  "response_batch_id": "CS-2025-01-16-001",
  "generated_date": "2025-01-16 10:00:00",

  "qa_responses": [
    {
      "question_id": "QA-12345",
      "question": "Will this fit an iPhone 15 Pro Max with a thick Otterbox case?",
      "asker": "John D.",
      "asked_date": "2025-01-16 08:30",
      "urgency": "Medium",

      "ai_generated_response": {
        "response": "Hi John! Great question. The ProGrip Phone Stand has adjustable grip arms that accommodate phones from 4-8 inches wide. The iPhone 15 Pro Max with an Otterbox Defender case is approximately 3.5 inches wide, which falls comfortably within our range.\n\nHowever, we've received feedback that some of the thicker Otterbox cases (especially the Defender Pro series) can be snug. The stand will hold the phone securely, but you may need to slightly adjust the grip arms.\n\nIf you experience any fit issues, please reach out to us - we're here to help and offer a 100% satisfaction guarantee.\n\nHope this helps!",

        "tone": "Friendly & Helpful",
        "key_points_covered": [
          "Acknowledges the question",
          "Provides specific width range",
          "Addresses potential concern honestly",
          "Offers solution/guarantee",
          "Invites further contact"
        ],
        "product_info_used": [
          "Grip range: 4-8 inches",
          "Feedback from review analysis"
        ],
        "confidence_score": 0.92
      },

      "suggested_edits": [
        "Consider mentioning we're working on a wider version",
        "Add link to size comparison image if available"
      ],

      "status": "Draft - Pending Review",
      "review_required": false,
      "auto_post_allowed": true
    },
    {
      "question_id": "QA-12346",
      "question": "Is this made in China?",
      "asker": "Sarah M.",
      "asked_date": "2025-01-16 09:15",
      "urgency": "Low",

      "ai_generated_response": {
        "response": "Hi Sarah! Yes, our ProGrip Phone Stand is manufactured in our partner facility in China, using high-quality PETG material. We maintain strict quality control standards and inspect every unit before shipping.\n\nAll materials are RoHS compliant and meet international safety standards. We're committed to delivering premium quality regardless of manufacturing location.\n\nIf you have any other questions, feel free to ask!",

        "tone": "Transparent & Professional",
        "confidence_score": 0.88,
        "sensitive_topic": true
      },

      "status": "Draft - Requires Review",
      "review_required": true,
      "reason_for_review": "Sensitive topic (country of origin), recommend manual review before posting"
    },
    {
      "question_id": "QA-12347",
      "question": "Can I use this while charging my phone?",
      "asker": "Mike K.",
      "asked_date": "2025-01-16 09:45",
      "urgency": "Low",

      "ai_generated_response": {
        "response": "Hi Mike! Absolutely! The ProGrip Phone Stand features built-in cable management channels specifically designed for this. You can route your charging cable through the integrated clips, keeping it neat and organized while your phone charges.\n\nThe weighted base is also designed to stay stable even with a charging cable attached. It's perfect for keeping your phone charged during video calls, watching content, or just as a bedside charging station.\n\nLet me know if you have any other questions!",

        "tone": "Enthusiastic & Helpful",
        "confidence_score": 0.95
      },

      "status": "Draft - Ready to Post",
      "auto_post_allowed": true
    }
  ],

  "customer_messages": [
    {
      "message_id": "MSG-78901",
      "from": "customer-12345@marketplace.amazon.com",
      "subject": "Product not rotating smoothly",
      "message": "I received the phone stand yesterday and the rotation is very stiff. Is this normal? Should I return it?",
      "received_date": "2025-01-16 07:30",
      "order_id": "123-4567890-1234567",
      "urgency": "High",

      "issue_classification": {
        "category": "Product Issue",
        "subcategory": "Mechanical Problem",
        "sentiment": "Concerned",
        "requires_replacement": "Possibly"
      },

      "ai_generated_response": {
        "response": "Hi there,\n\nThank you for reaching out, and I'm sorry to hear the rotation mechanism isn't as smooth as it should be.\n\nThe ProGrip stand is designed with a precision ball joint that should rotate smoothly with minimal effort. A stiff rotation is not normal and suggests the mechanism may need adjustment.\n\nHere's a quick troubleshooting step:\n1. Try rotating the stand back and forth 10-15 times to help break in the mechanism\n2. Check if there's any debris or packaging material in the joint\n\nHowever, if it remains stiff after this, I'd be happy to send you a replacement unit right away at no additional cost. Your satisfaction is our top priority.\n\nPlease let me know how you'd like to proceed, and I'll take care of it immediately.\n\nBest regards,\nProGrip Customer Care",

        "tone": "Empathetic & Solution-Oriented",
        "escalation_recommended": false,
        "replacement_offered": true,
        "confidence_score": 0.90
      },

      "status": "Draft - Requires Review",
      "review_required": true,
      "reason_for_review": "Potential product defect, replacement offer needs approval"
    }
  ],

  "review_responses": [
    {
      "review_id": "REV-45678",
      "rating": 5,
      "review_text": "Absolutely love this phone stand! The build quality is excellent and it looks great on my desk. The cable management is genius.",
      "reviewer": "Amanda L.",
      "review_date": "2025-01-15",
      "response_type": "Thank You",

      "ai_generated_response": {
        "response": "Thank you so much for the wonderful review, Amanda! We're thrilled to hear you're loving the ProGrip stand and that the cable management is working well for you. Comments like yours make our day and motivate us to keep delivering quality products. Enjoy your stand! 😊",

        "tone": "Grateful & Warm",
        "confidence_score": 0.93
      },

      "status": "Ready to Post",
      "priority": "Low"
    },
    {
      "review_id": "REV-45679",
      "rating": 3,
      "review_text": "Good product but the instructions were confusing. Took me a while to figure out how to assemble it. Once assembled, it works great.",
      "reviewer": "Robert T.",
      "review_date": "2025-01-15",
      "response_type": "Acknowledge & Improve",

      "ai_generated_response": {
        "response": "Hi Robert, thank you for your feedback! We're glad to hear the stand is working great for you once assembled.\n\nYou're absolutely right about the instructions - we've heard this from a few customers and we're already working on improving them. We're creating a video tutorial and updating the instruction card to make assembly much clearer.\n\nWe appreciate you taking the time to share this feedback. It helps us improve for future customers. If you have any other suggestions, we're all ears!\n\nBest regards,\nThe ProGrip Team",

        "tone": "Receptive & Proactive",
        "addresses_concern": true,
        "mentions_improvement": true,
        "confidence_score": 0.91
      },

      "status": "Draft - Pending Review",
      "priority": "Medium"
    },
    {
      "review_id": "REV-45680",
      "rating": 2,
      "review_text": "Stand is okay but doesn't fit my phone with my thick case. Had to take the case off every time. Not what I expected.",
      "reviewer": "Chris P.",
      "review_date": "2025-01-15",
      "response_type": "Apologize & Solution",

      "ai_generated_response": {
        "response": "Hi Chris, we sincerely apologize for the inconvenience. We understand how frustrating it is to have to remove your case each time.\n\nWhile the ProGrip is designed to fit phones 4-8 inches wide, we've learned that some of the thicker protective cases can be challenging. This is valuable feedback that we're using to improve the next version.\n\nWe'd like to make this right for you. Please reach out to us directly at support@progrip.com and we'll arrange either:\n1. A full refund (you can keep the stand)\n2. Credit toward our upcoming wide-grip model (coming March 2025)\n\nYour satisfaction matters to us. Thank you for giving us a chance to improve.\n\nBest,\nProGrip Customer Care",

        "tone": "Apologetic & Generous",
        "solution_offered": true,
        "acknowledges_product_limitation": true,
        "confidence_score": 0.88
      },

      "status": "Draft - Requires Approval",
      "review_required": true,
      "reason_for_review": "Offering refund/compensation, needs approval"
    }
  ],

  "analytics": {
    "total_responses_generated": 9,
    "auto_post_ready": 4,
    "requires_review": 5,
    "avg_confidence_score": 0.91,
    "estimated_time_saved": "2.5 hours",
    "topics_covered": {
      "Product fit/compatibility": 3,
      "Product quality": 2,
      "Assembly/instructions": 1,
      "Manufacturing origin": 1,
      "Usage questions": 2
    }
  }
}
```

### response_templates.json (知识库)
```json
{
  "templates": [
    {
      "category": "Product Specifications",
      "question_pattern": "(?i)(size|dimension|fit|compatible)",
      "template": "Hi {name}! The {product_name} {spec_info}. {additional_context} Let me know if you have any other questions!",
      "variables": {
        "product_name": "ProGrip Phone Stand",
        "spec_info": "accommodates devices from 4-8 inches wide, including iPhone, Samsung, Google Pixel, and most smartphones"
      }
    },
    {
      "category": "Shipping",
      "question_pattern": "(?i)(ship|deliver|arrive|how long)",
      "template": "Hi {name}! Orders typically ship within 1-2 business days via Amazon FBA. Prime members receive free 2-day shipping. Non-Prime delivery usually takes 5-7 business days. You'll receive tracking information once shipped!"
    },
    {
      "category": "Returns",
      "question_pattern": "(?i)(return|refund|money back)",
      "template": "Hi {name}! We offer a 30-day money-back guarantee. If you're not completely satisfied, you can return the {product_name} through Amazon's standard return process for a full refund. No questions asked!"
    }
  ],

  "product_knowledge_base": {
    "dimensions": "12cm x 8cm x 15cm",
    "weight": "85g",
    "material": "Premium PETG plastic",
    "compatibility": "4-8 inch devices",
    "features": [
      "360° rotation",
      "Adjustable 0-90° angles",
      "Built-in cable management",
      "Weighted non-slip base"
    ],
    "warranty": "1-year manufacturer warranty",
    "certifications": ["RoHS compliant", "FCC certified"]
  }
}
```

## AI Prompt设计

### Q&A回复生成
```python
def generate_qa_response(question, product_info):
    prompt = f"""
    你是ProGrip品牌的友好客服代表。请为以下Amazon产品问题生成回复。

    问题: {question}

    产品信息:
    {json.dumps(product_info, indent=2)}

    要求:
    1. 语气友好、专业、乐于助人
    2. 直接回答问题,提供具体信息
    3. 如果有潜在顾虑,主动解决
    4. 以开放式结尾邀请进一步提问
    5. 长度: 3-5句话
    6. 避免过度推销

    返回JSON格式:
    {{
      "response": "回复内容",
      "key_points": ["要点1", "要点2"],
      "tone": "语气描述"
    }}
    """

    response = ai_client.chat(
        model="anthropic/claude-3-sonnet",
        messages=[{"role": "user", "content": prompt}]
    )

    return json.loads(response.content)
```

## 执行频率
- **每2小时**: 检查新Q&A和客户消息
- **每日**: 生成评论回复草稿
- **实时**: 紧急消息(退换货)立即处理

## 技术实现
```python
class CSReplyAgent:
    def __init__(self, sp_api, ai_client):
        self.sp_api = sp_api
        self.ai = ai_client
        self.knowledge_base = self.load_knowledge_base()

    def process_qa_questions(self):
        # 1. 获取未回复问题
        questions = self.sp_api.get_qa_questions(answered=False)

        responses = []
        for q in questions:
            # 2. 生成回复
            response = self.generate_response(q)

            # 3. 审核机制
            if response['confidence_score'] > 0.90 and not response['sensitive_topic']:
                status = "Auto-post Ready"
            else:
                status = "Requires Review"

            responses.append({
                'question': q,
                'response': response,
                'status': status
            })

        # 4. 自动发布(如果允许)
        for r in responses:
            if r['status'] == "Auto-post Ready" and self.auto_post_enabled:
                self.post_qa_answer(r['question']['id'], r['response']['text'])

        return responses

    def generate_response(self, question):
        # 检查模板库
        template = self.match_template(question['text'])

        if template:
            # 使用模板
            response = self.fill_template(template, question)
        else:
            # AI生成
            response = self.ai_generate_response(question)

        return response

    def handle_customer_message(self, message):
        # 分类消息
        category = self.classify_message(message)

        # 生成回复
        if category == 'product_issue':
            response = self.handle_product_issue(message)
        elif category == 'order_inquiry':
            response = self.handle_order_inquiry(message)
        elif category == 'return_request':
            response = self.handle_return_request(message)
        else:
            response = self.ai_generate_response(message)

        return response
```

## 质量控制

### 回复审核清单
- [ ] 回答了客户的问题
- [ ] 语气友好专业
- [ ] 信息准确无误
- [ ] 无语法错误
- [ ] 符合品牌调性
- [ ] 未做过度承诺

### 自动发布规则
```yaml
auto_post_rules:
  enabled: true
  conditions:
    - confidence_score >= 0.90
    - no_sensitive_topics: true
    - question_type in ['product_spec', 'shipping', 'general_usage']
    - not_replacement_offer: true
    - not_refund_offer: true

  require_review_if:
    - sensitive_topics: ['country_of_origin', 'safety', 'legal']
    - offering_compensation: true
    - negative_sentiment: true
    - complex_question: true
```

## 依赖
- 上游: Review Insight Agent (了解常见问题)
- 外部API: Amazon SP-API, OpenRouter AI
- 知识库: Product information, FAQs

## 监控指标
```yaml
cs_metrics:
  response_time:
    target: "<4 hours for Q&A"
    alert_if: ">12 hours"

  ai_accuracy:
    target: "95% approval rate"
    measure: "approved_responses / total_generated"

  customer_satisfaction:
    measure: "helpful votes on responses"
    target: "85% helpful rate"
```

## 注意事项
1. 永远人工审核涉及退款/补偿的回复
2. 负面评论回复需特别谨慎
3. 不要在回复中批评竞品
4. 遵守Amazon社区准则
5. 定期更新知识库
6. 收集客户反馈优化AI
