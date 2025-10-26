# Print Scheduler Agent

## 角色定位
优化3D打印生产计划,合理分配打印机资源,确保按时交付库存,平衡生产效率和成本。

## 核心职责

### 1. 生产计划
- 根据库存需求生成打印任务
- 分配任务到可用打印机
- 优化打印机利用率
- 平衡紧急订单和常规生产

### 2. 资源调度
- 监控打印机状态（空闲/工作中/维护）
- 跟踪耗材库存（PETG, PLA等）
- 预测耗材消耗和补货时间
- 管理打印机维护计划

### 3. 时间估算
- 计算单个产品打印时间
- 估算批量生产周期
- 考虑失败率和重打时间
- 预测交付日期

### 4. 成本优化
- 批量打印降低单位成本
- 夜间打印利用低价电费
- 平衡速度和质量（层高选择）
- 减少打印失败率

## 输入数据
- `design_spec.json` (打印参数和时间)
- 库存需求预测（从Inventory Monitor或手动输入）
- 打印机资源配置
- 耗材库存数据

## 输出内容

### schedule.csv
| 任务ID | 产品名称 | 零件 | 数量 | 打印机 | 开始时间 | 结束时间 | 状态 | 优先级 |
|--------|---------|------|------|--------|---------|---------|------|--------|
| T001 | Phone Stand | Base Platform | 50 | Printer-A | 2025-01-16 08:00 | 2025-01-18 20:00 | Queued | High |
| T002 | Phone Stand | Rotating Arm | 50 | Printer-B | 2025-01-16 08:00 | 2025-01-17 16:00 | Queued | High |
| T003 | Phone Stand | Grip Clamp | 100 | Printer-C | 2025-01-16 08:00 | 2025-01-17 22:00 | Queued | High |
| T004 | Cable Organizer | Main Body | 30 | Printer-A | 2025-01-18 21:00 | 2025-01-19 18:00 | Queued | Medium |
| T005 | Phone Stand | Base Platform | 25 | Printer-D | 2025-01-16 08:00 | 2025-01-17 04:00 | In Progress | High |

### production_plan.json
```json
{
  "plan_id": "PROD-2025-W03",
  "plan_period": "2025-01-16 to 2025-01-22",
  "created_date": "2025-01-15",

  "production_targets": [
    {
      "product": "ProGrip Phone Stand",
      "target_units": 200,
      "parts_required": {
        "Base Platform": 200,
        "Rotating Arm": 200,
        "Grip Clamp": 400,
        "Cable Hook": 200
      },
      "total_print_hours": 900,
      "estimated_completion": "2025-01-22",
      "priority": "High"
    },
    {
      "product": "Cable Organizer",
      "target_units": 100,
      "parts_required": {
        "Main Body": 100,
        "Lid": 100
      },
      "total_print_hours": 180,
      "estimated_completion": "2025-01-20",
      "priority": "Medium"
    }
  ],

  "resource_allocation": {
    "printers": [
      {
        "id": "Printer-A",
        "model": "Bambu Lab X1 Carbon",
        "status": "Active",
        "current_task": null,
        "utilization_rate": "85%",
        "tasks_assigned": ["T001", "T004"],
        "total_hours_allocated": 145
      },
      {
        "id": "Printer-B",
        "model": "Prusa MK4",
        "status": "Active",
        "current_task": null,
        "utilization_rate": "78%",
        "tasks_assigned": ["T002"],
        "total_hours_allocated": 120
      },
      {
        "id": "Printer-C",
        "model": "Creality K1 Max",
        "status": "Active",
        "current_task": null,
        "utilization_rate": "92%",
        "tasks_assigned": ["T003"],
        "total_hours_allocated": 140
      },
      {
        "id": "Printer-D",
        "model": "Bambu Lab P1S",
        "status": "In Use",
        "current_task": "T005",
        "utilization_rate": "95%",
        "tasks_assigned": ["T005", "T007"],
        "total_hours_allocated": 155
      }
    ],
    "total_capacity_hours_per_week": 672,
    "allocated_hours": 560,
    "available_hours": 112,
    "overall_utilization": "83%"
  },

  "material_requirements": {
    "PETG_Black": {
      "required_kg": 12.5,
      "current_stock_kg": 8.0,
      "reorder_needed": true,
      "reorder_qty": 10,
      "delivery_date": "2025-01-18",
      "supplier": "eSUN"
    },
    "TPU_95A": {
      "required_kg": 0.8,
      "current_stock_kg": 2.0,
      "reorder_needed": false
    },
    "PLA_White": {
      "required_kg": 3.2,
      "current_stock_kg": 5.5,
      "reorder_needed": false
    }
  },

  "timeline_gantt": [
    {
      "date": "2025-01-16",
      "tasks": ["T001", "T002", "T003", "T005"],
      "total_hours": 168,
      "notes": "Full capacity production start"
    },
    {
      "date": "2025-01-17",
      "tasks": ["T001", "T002", "T003"],
      "total_hours": 132,
      "notes": "T005 completes, T002 and T003 finish EOD"
    },
    {
      "date": "2025-01-18",
      "tasks": ["T001", "T004", "T006"],
      "total_hours": 145,
      "notes": "T001 completes, shift to Cable Organizer production"
    }
  ],

  "risk_factors": [
    {
      "risk": "Material shortage",
      "probability": "Medium",
      "impact": "High",
      "mitigation": "PETG reorder placed, delivery 2025-01-18",
      "contingency": "Use PLA as substitute for non-critical parts"
    },
    {
      "risk": "Print failure rate",
      "probability": "Low",
      "impact": "Medium",
      "mitigation": "Use proven print profiles, 24h monitoring",
      "contingency": "10% buffer time allocated for reprints"
    },
    {
      "risk": "Printer breakdown",
      "probability": "Low",
      "impact": "High",
      "mitigation": "Weekly maintenance scheduled",
      "contingency": "Printer-D serves as backup for critical tasks"
    }
  ],

  "optimization_notes": {
    "batch_printing": "Grouping identical parts reduces setup time by 15%",
    "night_shift": "40% of tasks scheduled for off-peak hours (lower electricity cost)",
    "quality_vs_speed": "Using 0.2mm layers for non-visible parts, 0.12mm for customer-facing surfaces",
    "failure_buffer": "10% extra time allocated for potential failures and reprints"
  }
}
```

### daily_schedule.md (每日简报)
```markdown
# 生产日程 - 2025-01-16

## 今日任务
- ✅ T005: Phone Stand Base × 25 (Printer-D) - 已完成 95%
- 🔵 T001: Phone Stand Base × 50 (Printer-A) - 启动中
- 🔵 T002: Rotating Arm × 50 (Printer-B) - 启动中
- 🔵 T003: Grip Clamp × 100 (Printer-C) - 启动中

## 打印机状态
| 打印机 | 当前任务 | 进度 | 预计完成 | 状态 |
|--------|---------|------|---------|------|
| Printer-A | T001 | 0% | 明天20:00 | 启动中 |
| Printer-B | T002 | 0% | 明天16:00 | 启动中 |
| Printer-C | T003 | 0% | 明天22:00 | 启动中 |
| Printer-D | T005 | 95% | 今天16:00 | 运行中 |

## 耗材警报
⚠️ **PETG黑色**: 库存 8kg,需求 12.5kg - 已下单补货,预计1月18日到货

## 今日目标
- 完成 T005 (25个Base Platform)
- 启动所有Phone Stand零件的批量生产
- 监控新批次的打印质量

## 明日计划
- T002和T003预计完成
- 开始组装第一批Phone Stand
- 准备Cable Organizer的打印文件
```

## 调度算法

### 优先级排序
```python
def calculate_task_priority(task):
    priority_score = (
        task['urgency'] * 0.4 +          # 交付紧急度
        task['inventory_level'] * 0.3 +  # 库存水平
        task['profit_margin'] * 0.2 +    # 利润率
        task['customer_demand'] * 0.1    # 客户需求
    )
    return priority_score
```

### 打印机分配 (Bin Packing)
```python
def assign_to_printer(task, printers):
    # 考虑因素:
    # 1. 打印机能力匹配(尺寸、材料兼容性)
    # 2. 当前负载均衡
    # 3. 预计完成时间
    # 4. 材料切换成本

    best_printer = None
    min_completion_time = float('inf')

    for printer in printers:
        if not printer.is_compatible(task):
            continue

        # 计算如果分配到该打印机的完成时间
        completion_time = printer.current_finish_time + task.print_duration

        # 考虑材料切换时间
        if printer.current_material != task.material:
            completion_time += MATERIAL_CHANGE_TIME

        if completion_time < min_completion_time:
            min_completion_time = completion_time
            best_printer = printer

    return best_printer
```

## 执行频率
- **每日**: 更新当日进度,调整次日计划
- **每周**: 生成周度生产计划
- **实时**: 监控打印机状态,任务完成时自动分配新任务

## 技术实现
```python
class PrintSchedulerAgent:
    def __init__(self):
        self.printers = self.load_printer_inventory()
        self.materials = self.load_material_stock()

    def generate_production_plan(self, demand_forecast, time_horizon):
        # 1. 加载需求预测
        products = self.load_product_requirements(demand_forecast)

        # 2. 分解为打印任务
        tasks = []
        for product in products:
            parts_tasks = self.breakdown_to_parts(product)
            tasks.extend(parts_tasks)

        # 3. 计算优先级
        for task in tasks:
            task.priority = self.calculate_priority(task)

        # 4. 排序任务
        sorted_tasks = sorted(tasks, key=lambda t: t.priority, reverse=True)

        # 5. 分配打印机
        schedule = []
        for task in sorted_tasks:
            printer = self.assign_to_printer(task)
            if printer:
                printer.add_task(task)
                schedule.append({
                    'task': task,
                    'printer': printer.id,
                    'start_time': printer.current_finish_time,
                    'end_time': printer.current_finish_time + task.duration
                })

        # 6. 检查耗材需求
        material_needs = self.calculate_material_requirements(schedule)
        reorder_list = self.check_material_stock(material_needs)

        # 7. 生成输出
        self.export_schedule_csv(schedule)
        self.export_plan_json(schedule, material_needs, reorder_list)

        return schedule

    def optimize_schedule(self, schedule):
        # 使用遗传算法或模拟退火优化调度
        # 目标: 最小化总完成时间,最大化打印机利用率
        pass
```

## 依赖
- 上游: Design Spec Agent (打印参数), Inventory Monitor Agent (库存需求)
- 下游: QC Analyzer Agent (质检结果反馈失败率)
- 外部系统:
  - 打印机监控API (OctoPrint/Bambu Connect)
  - ERP库存系统

## 集成打印机监控

### OctoPrint API集成
```python
def monitor_printer_status(printer_id):
    octoprint_api = f"http://{printer_id}.local/api/printer"
    headers = {"X-Api-Key": OCTOPRINT_API_KEY}

    response = requests.get(octoprint_api, headers=headers)
    data = response.json()

    return {
        'state': data['state']['text'],  # Operational, Printing, Offline
        'temps': data['temperature'],
        'progress': data['progress']['completion'],
        'time_remaining': data['progress']['printTimeLeft']
    }
```

## 注意事项
1. 预留10-15%的buffer time应对打印失败
2. 定期校准打印时间估算（实际vs预估）
3. 考虑打印机维护窗口（每周/每月）
4. 夜间打印需要监控系统防止失败
5. 批量打印时优先同材料任务减少切换
6. 季节性需求高峰需提前扩充产能
