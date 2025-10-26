# Design Spec Agent

## 角色定位
将产品简报转化为详细的3D设计规格书，包括技术图纸、打印参数、材料清单，为实际3D建模提供精确指导。

## 核心职责

### 1. 技术规格细化
- 解析产品Brief中的设计要求
- 定义精确的尺寸和公差
- 确定装配关系和约束
- 规划打印方向和支撑策略

### 2. 材料和工艺定义
- 选择最优3D打印材料
- 确定打印参数（层高、填充率等）
- 规划后处理工艺
- 考虑成本和质量平衡

### 3. 设计参考生成
- 使用AI生成设计概念图
- 收集类似产品的参考
- 创建mood board和风格指南
- 提供CAD建模指导

### 4. BOM清单
- 列出所有零件和组件
- 估算材料用量
- 标注采购件和定制件
- 计算总成本

## 输入数据
- `product_brief.pdf` (Product Brief Agent)
- `product_brief_data.json`
- 3D打印材料数据库
- 工艺参数标准库

## 输出内容

### design_spec.json
```json
{
  "project_id": "OPP-2025-001",
  "product_name": "ProGrip Adjustable Phone Stand",
  "spec_version": "1.0",
  "created_date": "2025-01-16",

  "design_requirements": {
    "overall_dimensions": {
      "length": {"value": 120, "unit": "mm", "tolerance": "±2mm"},
      "width": {"value": 80, "unit": "mm", "tolerance": "±2mm"},
      "height": {"value": 150, "unit": "mm", "tolerance": "±2mm"}
    },
    "weight_target": {"value": 85, "unit": "g", "tolerance": "+10g"},
    "functional_requirements": [
      {
        "feature": "Rotation",
        "specification": "360° continuous rotation",
        "tolerance": "Smooth with <5° dead zone"
      },
      {
        "feature": "Angle Adjustment",
        "specification": "0-90° tilt range",
        "tolerance": "10° increments with click stops"
      },
      {
        "feature": "Phone Grip",
        "specification": "Hold phones 6-8.5cm wide",
        "tolerance": "±2mm grip force"
      }
    ]
  },

  "material_specification": {
    "primary_material": {
      "type": "PETG",
      "brand": "eSUN PETG+",
      "color": "Black (RAL 9005)",
      "properties": {
        "tensile_strength": "50 MPa",
        "heat_deflection": "70°C",
        "surface_finish": "Matte"
      }
    },
    "secondary_materials": [
      {
        "part": "Anti-slip pads",
        "material": "TPU 95A",
        "quantity": 4
      }
    ]
  },

  "print_parameters": {
    "layer_height": "0.2mm (draft) / 0.12mm (final)",
    "infill_pattern": "Gyroid",
    "infill_density": "25% (base) / 15% (arm)",
    "wall_count": 4,
    "top_bottom_layers": 5,
    "print_speed": {
      "outer_wall": "40mm/s",
      "inner_wall": "60mm/s",
      "infill": "80mm/s"
    },
    "temperature": {
      "nozzle": "235°C",
      "bed": "80°C",
      "chamber": "ambient"
    },
    "support": {
      "enable": true,
      "type": "Tree support",
      "overhang_angle": "45°"
    },
    "estimated_print_time": "4.5 hours",
    "estimated_material_usage": "45g"
  },

  "parts_breakdown": [
    {
      "part_id": "P001",
      "name": "Base Platform",
      "quantity": 1,
      "material": "PETG",
      "weight": "28g",
      "print_time": "1.2h",
      "notes": "Print with brim for bed adhesion"
    },
    {
      "part_id": "P002",
      "name": "Rotating Arm",
      "quantity": 1,
      "material": "PETG",
      "weight": "15g",
      "print_time": "0.8h",
      "notes": "Rotate 45° for optimal layer orientation"
    },
    {
      "part_id": "P003",
      "name": "Phone Grip Clamp",
      "quantity": 2,
      "material": "PETG",
      "weight": "8g each",
      "print_time": "0.5h each",
      "notes": "Mirror print for symmetry"
    },
    {
      "part_id": "P004",
      "name": "Cable Hook",
      "quantity": 1,
      "material": "PETG",
      "weight": "3g",
      "print_time": "0.2h",
      "notes": "Optional accessory"
    }
  ],

  "assembly_instructions": {
    "steps": [
      "1. Insert rotating joint into base platform",
      "2. Attach arm to rotating joint with M3x10 screw",
      "3. Click phone grips onto arm slots",
      "4. Apply TPU anti-slip pads to base",
      "5. Attach cable hook if needed"
    ],
    "tools_required": ["Phillips screwdriver", "Hex key 2.5mm"],
    "estimated_assembly_time": "5 minutes"
  },

  "bom": {
    "printed_parts_cost": 2.50,
    "hardware": [
      {"item": "M3x10 screw", "quantity": 1, "unit_cost": 0.05, "total": 0.05},
      {"item": "M3 hex nut", "quantity": 1, "unit_cost": 0.03, "total": 0.03},
      {"item": "TPU pad (self-adhesive)", "quantity": 4, "unit_cost": 0.10, "total": 0.40}
    ],
    "hardware_total": 0.48,
    "total_material_cost": 2.98
  },

  "design_references": {
    "concept_sketches": ["concept_v1.png", "concept_v2.png"],
    "ai_generated_renders": ["ai_render_1.png", "ai_render_2.png"],
    "inspiration_images": [
      "https://example.com/ref1.jpg",
      "https://example.com/ref2.jpg"
    ],
    "competitor_teardown": "competitor_analysis_photos/"
  },

  "cad_modeling_guide": {
    "software_recommendation": "Fusion 360 / Blender",
    "file_formats": ["STL", "STEP", "3MF"],
    "modeling_notes": [
      "Use parametric design for easy adjustments",
      "Apply 0.5mm chamfer to all sharp edges",
      "Ensure snap-fit tolerances of 0.2-0.3mm",
      "Design for printability (no overhangs >50°)"
    ]
  },

  "quality_criteria": {
    "dimensional_accuracy": "±0.5mm on critical features",
    "surface_finish": "Layer lines acceptable, no stringing",
    "mechanical_strength": "Support 500g phone without deflection",
    "durability": "5000+ adjustment cycles without wear"
  }
}
```

### design_spec_visual.pdf
包含：
- 产品渲染图（AI生成）
- 技术图纸和尺寸标注
- 爆炸视图和装配指南
- 材料和表面处理说明
- 打印方向示意图

## AI生成设计概念

### 使用DALL-E/Midjourney生成参考图
```python
def generate_concept_images(product_brief):
    prompt = f"""
    Product design concept for {product_brief['product_name']}

    Style: Modern minimalist, sleek, professional
    Features: {', '.join(product_brief['features'])}
    Materials: PETG plastic, matte black finish
    Context: Desktop office setting

    Requirements:
    - Clean lines and geometric shapes
    - Show phone mounted at 45° angle
    - Emphasize adjustability and stability
    - Professional product photography style
    - Neutral background

    Generate a photorealistic 3D render from 3/4 view angle.
    """

    images = ai_image_client.generate(
        prompt=prompt,
        model="dall-e-3",
        size="1024x1024",
        quality="hd",
        n=3
    )
    return images
```

## 执行频率
- **按需触发**: Product Brief完成后立即执行
- **迭代**: 设计修改时重新生成
- **版本控制**: 保留所有spec版本

## 技术实现
```python
class DesignSpecAgent:
    def __init__(self, ai_client):
        self.ai_client = ai_client

    def generate_design_spec(self, product_brief_path):
        # 1. 解析产品Brief
        brief = self.load_brief(product_brief_path)

        # 2. 细化技术规格
        dimensions = self.calculate_dimensions(brief)
        materials = self.select_materials(brief)
        print_params = self.define_print_parameters(materials)

        # 3. 生成BOM
        parts = self.breakdown_parts(brief, materials)
        bom = self.calculate_bom(parts)

        # 4. AI生成设计参考
        concept_images = self.generate_concept_images(brief)

        # 5. 组装规格文档
        spec = {
            "design_requirements": dimensions,
            "material_specification": materials,
            "print_parameters": print_params,
            "parts_breakdown": parts,
            "bom": bom,
            "design_references": concept_images
        }

        # 6. 输出JSON和PDF
        self.save_json(spec, 'design_spec.json')
        self.create_visual_pdf(spec, 'design_spec_visual.pdf')

        return spec

    def select_materials(self, brief):
        # 基于强度、成本、美观度选择材料
        if brief['use_case'] == 'heavy_duty':
            return {'primary': 'PETG', 'secondary': 'Carbon-fiber PLA'}
        elif brief['price_tier'] == 'budget':
            return {'primary': 'PLA', 'secondary': 'PLA'}
        else:
            return {'primary': 'PETG', 'secondary': 'TPU'}

    def define_print_parameters(self, material):
        # 查询材料数据库获取最优打印参数
        material_db = {
            'PETG': {
                'nozzle_temp': 235,
                'bed_temp': 80,
                'speed': 60,
                'infill': 25
            },
            'PLA': {
                'nozzle_temp': 205,
                'bed_temp': 60,
                'speed': 80,
                'infill': 20
            }
        }
        return material_db.get(material['primary'], {})
```

## 依赖
- 上游: Product Brief Agent
- 下游:
  - Cost Estimator Agent (使用BOM数据)
  - 3D建模师/CAD软件
- 外部依赖:
  - AI图像生成 (DALL-E/Midjourney)
  - 材料数据库
  - PDF生成库

## 质量检查清单
- [ ] 所有关键尺寸已标注公差
- [ ] 材料选择考虑了强度和成本
- [ ] 打印参数可行且经过验证
- [ ] BOM完整且成本准确
- [ ] 提供了足够的视觉参考
- [ ] CAD建模指南清晰可执行
- [ ] 装配说明详细易懂

## 注意事项
1. 考虑3D打印的设计限制（悬垂、桥接等）
2. 平衡美观和可打印性
3. 留出足够的公差避免装配问题
4. 材料成本估算要保守
5. 使用参数化设计便于快速迭代
