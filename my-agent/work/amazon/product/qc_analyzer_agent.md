# QC Analyzer Agent

## 角色定位
自动化质量检测和分析,使用AI视觉识别打印缺陷,收集质量数据,优化生产参数,确保产品一致性。

## 核心职责

### 1. 视觉质量检测
- 使用摄像头拍摄成品照片
- AI识别打印缺陷(分层、翘曲、拉丝等)
- 检测尺寸精度(可选: 配合卡尺/量规)
- 表面质量评分

### 2. 缺陷分类和记录
- 分类缺陷类型和严重程度
- 记录缺陷位置和频率
- 关联缺陷与打印参数
- 追溯到具体打印机和批次

### 3. 数据分析
- 计算良品率和缺陷率
- 识别缺陷模式和趋势
- 对比不同打印机的质量表现
- 分析材料批次的影响

### 4. 参数优化建议
- 基于缺陷数据提出参数调整建议
- 优化打印profile减少失败率
- 预测性维护提醒
- 持续改进跟踪

## 输入数据
- 产品照片(手机拍摄或固定相机)
- `design_spec.json` (质量标准)
- `schedule.csv` (生产批次信息)
- 打印机参数和设置

## 输出内容

### qc_report.csv
| 批次ID | 产品 | 零件 | 打印机 | 检测时间 | 总数 | 合格 | 不合格 | 良品率 | 主要缺陷 |
|--------|------|------|--------|---------|------|------|--------|--------|---------|
| B001 | Phone Stand | Base | Printer-A | 2025-01-16 10:30 | 25 | 24 | 1 | 96% | Layer shift |
| B002 | Phone Stand | Arm | Printer-B | 2025-01-16 11:15 | 25 | 23 | 2 | 92% | Stringing |
| B003 | Phone Stand | Grip | Printer-C | 2025-01-16 14:20 | 50 | 48 | 2 | 96% | Warping |
| B004 | Cable Org | Body | Printer-D | 2025-01-16 16:00 | 30 | 30 | 0 | 100% | None |

### defect_analysis.json
```json
{
  "report_id": "QC-2025-W03",
  "period": "2025-01-16 to 2025-01-22",
  "created_date": "2025-01-22",

  "overall_metrics": {
    "total_units_inspected": 2450,
    "passed": 2338,
    "failed": 112,
    "overall_pass_rate": "95.4%",
    "target_pass_rate": "97%",
    "status": "Below Target"
  },

  "defect_breakdown": [
    {
      "defect_type": "Stringing",
      "count": 45,
      "percentage": "40.2%",
      "severity": "Minor",
      "root_cause": "Retraction settings",
      "affected_printers": ["Printer-B", "Printer-C"],
      "fix_applied": "Increase retraction distance to 0.8mm"
    },
    {
      "defect_type": "Layer Shift",
      "count": 28,
      "percentage": "25.0%",
      "severity": "Critical",
      "root_cause": "Belt tension",
      "affected_printers": ["Printer-A"],
      "fix_applied": "Tightened Y-axis belt, scheduled maintenance"
    },
    {
      "defect_type": "Warping",
      "count": 22,
      "percentage": "19.6%",
      "severity": "Major",
      "root_cause": "Bed adhesion",
      "affected_printers": ["Printer-C"],
      "fix_applied": "Increased bed temp to 85°C, added brim"
    },
    {
      "defect_type": "Under-extrusion",
      "count": 12,
      "percentage": "10.7%",
      "severity": "Major",
      "root_cause": "Nozzle partial clog",
      "affected_printers": ["Printer-B"],
      "fix_applied": "Cold pull cleaning, replaced nozzle"
    },
    {
      "defect_type": "Dimensional Inaccuracy",
      "count": 5,
      "percentage": "4.5%",
      "severity": "Minor",
      "root_cause": "Calibration drift",
      "affected_printers": ["Printer-D"],
      "fix_applied": "Re-calibrated XYZ steps/mm"
    }
  ],

  "printer_performance": [
    {
      "printer_id": "Printer-A",
      "units_produced": 620,
      "pass_rate": "94.2%",
      "main_issue": "Layer shift (28 cases)",
      "trend": "Declining ↓",
      "action": "Urgent maintenance required"
    },
    {
      "printer_id": "Printer-B",
      "units_produced": 580,
      "pass_rate": "93.8%",
      "main_issue": "Stringing (22 cases)",
      "trend": "Stable →",
      "action": "Profile optimization"
    },
    {
      "printer_id": "Printer-C",
      "units_produced": 650,
      "pass_rate": "95.1%",
      "main_issue": "Warping (22 cases)",
      "trend": "Improving ↑",
      "action": "Monitor bed adhesion"
    },
    {
      "printer_id": "Printer-D",
      "units_produced": 600,
      "pass_rate": "98.3%",
      "main_issue": "Minimal defects",
      "trend": "Excellent ↑",
      "action": "Use as quality benchmark"
    }
  ],

  "material_batch_analysis": {
    "PETG_Batch_2401": {
      "kg_used": 8.5,
      "units_produced": 1200,
      "pass_rate": "96.8%",
      "notes": "Excellent consistency"
    },
    "PETG_Batch_2402": {
      "kg_used": 4.2,
      "units_produced": 650,
      "pass_rate": "92.1%",
      "notes": "More stringing issues, possibly moisture absorption"
    }
  },

  "ai_vision_detection": {
    "model_version": "YOLOv8-DefectDetect-v2.1",
    "accuracy": "94.3%",
    "false_positive_rate": "3.2%",
    "false_negative_rate": "2.5%",
    "detected_defect_types": [
      "stringing", "layer_shift", "warping",
      "under_extrusion", "over_extrusion",
      "surface_roughness", "dimensional_error"
    ],
    "sample_images": {
      "pass": "qc_images/pass_examples/",
      "fail": "qc_images/fail_examples/"
    }
  },

  "optimization_recommendations": [
    {
      "priority": "High",
      "issue": "Printer-A layer shift",
      "recommendation": "Immediate belt tension check and lubrication",
      "expected_improvement": "Restore pass rate to 97%+",
      "cost": "$0 (maintenance)",
      "time": "30 minutes"
    },
    {
      "priority": "Medium",
      "issue": "Stringing on multiple printers",
      "recommendation": "Dry PETG filament (65°C for 4 hours)",
      "expected_improvement": "Reduce stringing by 60%",
      "cost": "$0 (existing dryer)",
      "time": "4 hours passive"
    },
    {
      "priority": "Medium",
      "issue": "PETG Batch 2402 quality",
      "recommendation": "Switch to Batch 2401 supplier or dry before use",
      "expected_improvement": "Bring pass rate back to 96%+",
      "cost": "$0-50",
      "time": "Immediate"
    },
    {
      "priority": "Low",
      "issue": "Printer-D calibration drift",
      "recommendation": "Monthly calibration routine",
      "expected_improvement": "Maintain 98%+ pass rate",
      "cost": "$0 (maintenance)",
      "time": "15 minutes monthly"
    }
  ],

  "trend_analysis": {
    "week_over_week": {
      "current_week_pass_rate": "95.4%",
      "last_week_pass_rate": "96.8%",
      "change": "-1.4%",
      "status": "Declining trend - action needed"
    },
    "monthly_average": "96.2%",
    "best_day": {"date": "2025-01-20", "pass_rate": "98.1%"},
    "worst_day": {"date": "2025-01-17", "pass_rate": "92.3%", "reason": "Printer-A belt issue"}
  }
}
```

### defect_images/ (照片归档)
```
qc_images/
├── 2025-01-16/
│   ├── pass/
│   │   ├── B001_01.jpg
│   │   ├── B001_02.jpg
│   ├── fail/
│   │   ├── B001_25_layer_shift.jpg
│   │   ├── B002_12_stringing.jpg
│   └── annotated/
│       └── B001_25_annotated.jpg  # AI标注缺陷位置
```

## AI视觉检测

### 使用OpenAI Vision API
```python
def detect_defects_with_ai(image_path):
    with open(image_path, 'rb') as img_file:
        image_data = base64.b64encode(img_file.read()).decode()

    prompt = """
    你是一位3D打印质量检测专家。请分析这张3D打印部件的照片。

    检测以下缺陷类型:
    1. 拉丝 (Stringing)
    2. 层偏移 (Layer Shift)
    3. 翘曲 (Warping)
    4. 挤出不足 (Under-extrusion)
    5. 表面粗糙 (Surface Roughness)
    6. 尺寸变形 (Dimensional Error)

    返回JSON格式:
    {
      "verdict": "Pass" or "Fail",
      "defects_found": ["defect_type_1", "defect_type_2"],
      "severity": "Minor" / "Major" / "Critical",
      "quality_score": 0-100,
      "notes": "简短描述"
    }
    """

    response = openai.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image_data}"}
                ]
            }
        ],
        max_tokens=500
    )

    result = json.loads(response.choices[0].message.content)
    return result
```

### 使用YOLOv8自训练模型(更快更便宜)
```python
from ultralytics import YOLO

class DefectDetectionModel:
    def __init__(self, model_path='defect_detector_yolov8.pt'):
        self.model = YOLO(model_path)

    def detect(self, image_path):
        results = self.model(image_path)

        defects = []
        for r in results:
            for box in r.boxes:
                defect = {
                    'type': r.names[int(box.cls)],
                    'confidence': float(box.conf),
                    'bbox': box.xyxy[0].tolist()
                }
                defects.append(defect)

        verdict = "Fail" if len(defects) > 0 else "Pass"
        severity = self._assess_severity(defects)

        return {
            'verdict': verdict,
            'defects_found': [d['type'] for d in defects],
            'severity': severity,
            'quality_score': self._calculate_score(defects),
            'bbox_annotations': defects
        }

    def _assess_severity(self, defects):
        critical = ['layer_shift', 'major_warping']
        if any(d['type'] in critical for d in defects):
            return 'Critical'
        elif len(defects) > 2:
            return 'Major'
        else:
            return 'Minor'
```

## 执行频率
- **每批次**: 完成打印后立即检测
- **每日**: 汇总当日质量报告
- **每周**: 生成周度质量分析和优化建议
- **实时**: AI视觉检测(可选: 实时相机监控)

## 技术实现
```python
class QCAnalyzerAgent:
    def __init__(self):
        self.vision_model = DefectDetectionModel()
        self.quality_standards = self.load_quality_standards()

    def inspect_batch(self, batch_id, image_paths):
        results = []

        for image_path in image_paths:
            # AI视觉检测
            detection = self.vision_model.detect(image_path)

            # 记录结果
            result = {
                'batch_id': batch_id,
                'image': image_path,
                'timestamp': datetime.now(),
                **detection
            }
            results.append(result)

            # 保存标注图片
            if detection['verdict'] == 'Fail':
                self._save_annotated_image(image_path, detection)

        # 计算批次统计
        batch_stats = self._calculate_batch_stats(results)

        # 更新数据库
        self._update_qc_database(batch_id, batch_stats)

        return batch_stats

    def generate_weekly_report(self):
        # 从数据库拉取一周数据
        weekly_data = self._fetch_weekly_qc_data()

        # 分析缺陷模式
        defect_analysis = self._analyze_defect_patterns(weekly_data)

        # 对比打印机表现
        printer_comparison = self._compare_printer_performance(weekly_data)

        # 生成优化建议
        recommendations = self._generate_recommendations(defect_analysis, printer_comparison)

        # 导出报告
        report = {
            'overall_metrics': self._calculate_overall_metrics(weekly_data),
            'defect_breakdown': defect_analysis,
            'printer_performance': printer_comparison,
            'optimization_recommendations': recommendations
        }

        self._export_json(report, 'qc_report.json')
        self._export_csv(weekly_data, 'qc_details.csv')

        return report
```

## 依赖
- 上游: Print Scheduler Agent (批次信息)
- 下游: Print Scheduler Agent (反馈失败率优化生产)
- 硬件:
  - 相机/手机(拍摄照片)
  - 可选: 卡尺/量规(精确测量)
- AI模型:
  - OpenAI Vision API 或
  - 自训练YOLOv8模型

## 训练自定义缺陷检测模型

### 数据集准备
1. 收集1000+张打印件照片(合格+不合格)
2. 使用Roboflow/LabelImg标注缺陷
3. 按80/10/10分割训练/验证/测试集
4. 数据增强(旋转、亮度调整)

### 训练YOLOv8
```python
from ultralytics import YOLO

# 加载预训练模型
model = YOLO('yolov8n.pt')

# 训练
model.train(
    data='defect_dataset.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    name='defect_detector'
)

# 验证
metrics = model.val()
print(f"mAP50: {metrics.box.map50}")

# 导出
model.export(format='onnx')
```

## 注意事项
1. 照明条件要一致,建议使用灯箱
2. 拍摄角度和距离标准化
3. 定期用已知样品校准AI模型
4. 人工复检AI判断为Fail的案例
5. 持续收集数据改进模型准确率
6. 缺陷数据隐私保护(不外传)
