"""
配置管理模块
用于统一管理所有脚本的输入输出路径配置
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# 加载 .env 文件
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# 获取配置
OUTPUT_DIR = os.getenv('OUTPUT_DIR', '/Users/liujinxingzheng/Documents/ai-file/download')
DATA_DIR = os.getenv('DATA_DIR', '/Users/liujinxingzheng/Documents/ai-file/amz-sponsore')

# 确保输出目录存在
def ensure_output_dir(subdir=None):
    """
    确保输出目录存在，如果需要可以创建子目录

    Args:
        subdir: 子目录名称，如 '广告调整建议'

    Returns:
        完整的输出路径
    """
    if subdir:
        output_path = os.path.join(OUTPUT_DIR, subdir)
    else:
        output_path = OUTPUT_DIR

    os.makedirs(output_path, exist_ok=True)
    return output_path

# 获取数据文件路径
def get_data_path(relative_path):
    """
    获取数据文件的完整路径

    Args:
        relative_path: 相对于 DATA_DIR 的路径

    Returns:
        完整的文件路径
    """
    return os.path.join(DATA_DIR, relative_path)

# 获取输出文件路径
def get_output_path(filename, subdir=None):
    """
    获取输出文件的完整路径

    Args:
        filename: 文件名
        subdir: 子目录名称

    Returns:
        完整的输出文件路径
    """
    output_dir = ensure_output_dir(subdir)
    return os.path.join(output_dir, filename)

if __name__ == '__main__':
    # 测试配置
    print(f"输出目录: {OUTPUT_DIR}")
    print(f"数据目录: {DATA_DIR}")
    print(f"\n测试创建子目录:")
    test_path = ensure_output_dir('广告调整建议')
    print(f"创建路径: {test_path}")
