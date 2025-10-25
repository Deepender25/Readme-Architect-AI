"""
Deep Code Analysis System for Enhanced README Generation
Provides comprehensive project understanding for 100% accurate documentation
"""

import os
import ast
import json
import re
import subprocess
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path

class DeepProjectAnalyzer:
    """Advanced project analyzer that provides deep insights into codebase structure and functionality"""
    
    def __init__(self, repo_path: str):
        self.repo_path = repo_path
        self.analysis = {
            'project_type': None,
            'main_technologies': [],
            'frameworks': [],
            'databases': [],
            'apis_used': [],
            'deployment_targets': [],
            'testing_frameworks': [],
            'build_tools': [],
            'package_managers': [],
            'environment_variables': [],
            'entry_points': [],
            'key_features': [],
            'architecture_patterns': [],
            'external_services': [],
            'file_analysis': {},
            'dependency_analysis': {},
            'code_metrics': {},
            'documentation_files': [],
            'config_files': [],
            'scripts': [],
            'actual_functionality': [],
            'data_models': [],
            'api_endpoints': [],
            'ui_components': [],
            'business_logic': []
        }
    
    def analyze_project(self) -> Dict[str, Any]:
        """Perform comprehensive project analysis"""
        print("🔍 Starting deep project analysis...")
        
        # Core analysis steps
        self._analyze_file_structure()
        self._analyze_dependencies()
        self._analyze_code_files()
        self._analyze_configuration()
        self._analyze_documentation()
        self._detect_project_type()
        self._analyze_architecture_patterns()
        self._extract_actual_functionality()
        self._analyze_data_models()
        self._analyze_api_endpoints()
        self._analyze_ui_components()
        self._calculate_metrics()
        
        print("✅ Deep analysis completed")
        return self.analysis
    
    def _analyze_file_structure(self):
        """Analyze file structure to understand project organization"""
        structure_indicators = {
            'web_app': ['src/', 'public/', 'components/', 'pages/', 'app/'],
            'api': ['api/', 'routes/', 'controllers/', 'endpoints/'],
            'mobile': ['android/', 'ios/', 'mobile/', 'react-native/'],
            'desktop': ['electron/', 'desktop/', 'gui/'],
            'ml_project': ['models/', 'data/', 'notebooks/', 'training/'],
            'game': ['assets/', 'scenes/', 'sprites/', 'levels/'],
            'library': ['lib/', 'src/', 'dist/', 'build/'],
            'microservice': ['services/', 'docker/', 'k8s/', 'helm/']
        }
        
        found_dirs = []
        for root, dirs, files in os.walk(self.repo_path):
            for dir_name in dirs:
                found_dirs.append(dir_name.lower())
        
        # Detect project type based on directory structure
        for project_type, indicators in structure_indicators.items():
            matches = sum(1 for indicator in indicators if any(indicator.rstrip('/') in d for d in found_dirs))
            if matches >= 2:  # Need at least 2 indicators
                if not self.analysis['project_type']:
                    self.analysis['project_type'] = project_type
    
    def _analyze_dependencies(self):
        """Deep analysis of all dependency files"""
        dependency_files = {
            'package.json': self._analyze_package_json,
            'requirements.txt': self._analyze_requirements_txt,
            'Pipfile': self._analyze_pipfile,
            'pyproject.toml': self._analyze_pyproject_toml,
            'Cargo.toml': self._analyze_cargo_toml,
            'go.mod': self._analyze_go_mod,
            'composer.json': self._analyze_composer_json,
            'Gemfile': self._analyze_gemfile,
            'pom.xml': self._analyze_pom_xml,
            'build.gradle': self._analyze_gradle,
            'CMakeLists.txt': self._analyze_cmake
        }
        
        for filename, analyzer in dependency_files.items():
            file_path = os.path.join(self.repo_path, filename)
            if os.path.exists(file_path):
                try:
                    analyzer(file_path)
                except Exception as e:
                    print(f"⚠️ Error analyzing {filename}: {e}")
    
    def _analyze_package_json(self, file_path: str):
        """Analyze Node.js package.json for detailed insights"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.analysis['package_managers'].append('npm')
            
            # Analyze dependencies
            deps = {**data.get('dependencies', {}), **data.get('devDependencies', {})}
            
            # Framework detection
            frameworks = {
                'react': ['react', '@types/react'],
                'vue': ['vue', '@vue/'],
                'angular': ['@angular/', 'angular'],
                'svelte': ['svelte'],
                'next.js': ['next'],
                'nuxt': ['nuxt'],
                'express': ['express'],
                'fastify': ['fastify'],
                'koa': ['koa'],
                'nest': ['@nestjs/'],
                'electron': ['electron'],
                'react-native': ['react-native']
            }
            
            for framework, indicators in frameworks.items():
                if any(any(indicator in dep for indicator in indicators) for dep in deps.keys()):
                    if framework not in self.analysis['frameworks']:
                        self.analysis['frameworks'].append(framework)
            
            # Database detection
            db_indicators = {
                'mongodb': ['mongoose', 'mongodb'],
                'postgresql': ['pg', 'postgres', 'sequelize'],
                'mysql': ['mysql', 'mysql2'],
                'sqlite': ['sqlite3', 'better-sqlite3'],
                'redis': ['redis', 'ioredis'],
                'firebase': ['firebase', '@firebase/']
            }
            
            for db, indicators in db_indicators.items():
                if any(any(indicator in dep for indicator in indicators) for dep in deps.keys()):
                    if db not in self.analysis['databases']:
                        self.analysis['databases'].append(db)
            
            # Testing frameworks
            test_frameworks = {
                'jest': ['jest', '@jest/'],
                'mocha': ['mocha'],
                'chai': ['chai'],
                'cypress': ['cypress'],
                'playwright': ['playwright', '@playwright/'],
                'vitest': ['vitest']
            }
            
            for framework, indicators in test_frameworks.items():
                if any(any(indicator in dep for indicator in indicators) for dep in deps.keys()):
                    if framework not in self.analysis['testing_frameworks']:
                        self.analysis['testing_frameworks'].append(framework)
            
            # Build tools
            build_tools = {
                'webpack': ['webpack'],
                'vite': ['vite'],
                'rollup': ['rollup'],
                'parcel': ['parcel'],
                'esbuild': ['esbuild'],
                'turbo': ['turbo'],
                'lerna': ['lerna']
            }
            
            for tool, indicators in build_tools.items():
                if any(any(indicator in dep for indicator in indicators) for dep in deps.keys()):
                    if tool not in self.analysis['build_tools']:
                        self.analysis['build_tools'].append(tool)
            
            # Scripts analysis
            scripts = data.get('scripts', {})
            self.analysis['scripts'].extend([f"npm run {name}" for name in scripts.keys()])
            
            # Entry points
            if 'main' in data:
                self.analysis['entry_points'].append(data['main'])
            
            self.analysis['dependency_analysis']['package.json'] = {
                'total_dependencies': len(deps),
                'production_deps': len(data.get('dependencies', {})),
                'dev_dependencies': len(data.get('devDependencies', {})),
                'scripts': list(scripts.keys())
            }
            
        except Exception as e:
            print(f"Error analyzing package.json: {e}")
    
    def _analyze_requirements_txt(self, file_path: str):
        """Analyze Python requirements.txt"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            self.analysis['package_managers'].append('pip')
            
            # Framework detection
            frameworks = {
                'django': ['django', 'Django'],
                'flask': ['flask', 'Flask'],
                'fastapi': ['fastapi', 'FastAPI'],
                'streamlit': ['streamlit'],
                'gradio': ['gradio'],
                'pytorch': ['torch', 'pytorch'],
                'tensorflow': ['tensorflow', 'tf'],
                'scikit-learn': ['sklearn', 'scikit-learn'],
                'pandas': ['pandas'],
                'numpy': ['numpy'],
                'opencv': ['opencv', 'cv2']
            }
            
            deps = [line.strip().split('==')[0].split('>=')[0].split('<=')[0].lower() for line in lines if line.strip() and not line.startswith('#')]
            
            for framework, indicators in frameworks.items():
                if any(any(indicator.lower() in dep for indicator in indicators) for dep in deps):
                    if framework not in self.analysis['frameworks']:
                        self.analysis['frameworks'].append(framework)
            
            # Database detection
            db_indicators = {
                'postgresql': ['psycopg2', 'asyncpg'],
                'mysql': ['pymysql', 'mysql-connector'],
                'sqlite': ['sqlite3'],
                'mongodb': ['pymongo', 'motor'],
                'redis': ['redis', 'aioredis']
            }
            
            for db, indicators in db_indicators.items():
                if any(any(indicator.lower() in dep for indicator in indicators) for dep in deps):
                    if db not in self.analysis['databases']:
                        self.analysis['databases'].append(db)
            
            self.analysis['dependency_analysis']['requirements.txt'] = {
                'total_dependencies': len(deps),
                'dependencies': deps[:10]  # First 10 for brevity
            }
            
        except Exception as e:
            print(f"Error analyzing requirements.txt: {e}")
    
    def _analyze_pyproject_toml(self, file_path: str):
        """Analyze Python pyproject.toml"""
        try:
            import toml
            with open(file_path, 'r', encoding='utf-8') as f:
                data = toml.load(f)
            
            # Build system detection
            build_system = data.get('build-system', {})
            if 'poetry' in str(build_system):
                self.analysis['package_managers'].append('poetry')
            elif 'setuptools' in str(build_system):
                self.analysis['build_tools'].append('setuptools')
            
        except Exception as e:
            print(f"Error analyzing pyproject.toml: {e}")
    
    def _analyze_pipfile(self, file_path: str):
        """Analyze Python Pipfile"""
        self.analysis['package_managers'].append('pipenv')
    
    def _analyze_cargo_toml(self, file_path: str):
        """Analyze Rust Cargo.toml"""
        self.analysis['main_technologies'].append('rust')
        self.analysis['package_managers'].append('cargo')
    
    def _analyze_go_mod(self, file_path: str):
        """Analyze Go go.mod"""
        self.analysis['main_technologies'].append('go')
        self.analysis['package_managers'].append('go modules')
    
    def _analyze_composer_json(self, file_path: str):
        """Analyze PHP composer.json"""
        self.analysis['main_technologies'].append('php')
        self.analysis['package_managers'].append('composer')
    
    def _analyze_gemfile(self, file_path: str):
        """Analyze Ruby Gemfile"""
        self.analysis['main_technologies'].append('ruby')
        self.analysis['package_managers'].append('bundler')
    
    def _analyze_pom_xml(self, file_path: str):
        """Analyze Java pom.xml"""
        self.analysis['main_technologies'].append('java')
        self.analysis['package_managers'].append('maven')
    
    def _analyze_gradle(self, file_path: str):
        """Analyze Gradle build files"""
        self.analysis['main_technologies'].append('java')
        self.analysis['build_tools'].append('gradle')
    
    def _analyze_cmake(self, file_path: str):
        """Analyze CMake files"""
        self.analysis['main_technologies'].append('c++')
        self.analysis['build_tools'].append('cmake')
    
    def _analyze_code_files(self):
        """Analyze actual code files for deep insights"""
        code_extensions = {
            '.py': self._analyze_python_file,
            '.js': self._analyze_javascript_file,
            '.ts': self._analyze_typescript_file,
            '.jsx': self._analyze_react_file,
            '.tsx': self._analyze_react_file,
            '.java': self._analyze_java_file,
            '.cpp': self._analyze_cpp_file,
            '.c': self._analyze_c_file,
            '.rs': self._analyze_rust_file,
            '.go': self._analyze_go_file,
            '.php': self._analyze_php_file,
            '.rb': self._analyze_ruby_file,
            '.swift': self._analyze_swift_file,
            '.kt': self._analyze_kotlin_file
        }
        
        for root, dirs, files in os.walk(self.repo_path):
            # Skip common ignore directories
            dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.venv', 'venv', 'target', 'dist', 'build', '.next']]
            
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = os.path.splitext(file)[1].lower()
                
                if file_ext in code_extensions:
                    try:
                        code_extensions[file_ext](file_path)
                    except Exception as e:
                        print(f"⚠️ Error analyzing {file_path}: {e}")
    
    def _analyze_python_file(self, file_path: str):
        """Deep analysis of Python files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse AST for detailed analysis
            try:
                tree = ast.parse(content)
                
                # Extract imports to understand dependencies
                imports = []
                for node in ast.walk(tree):
                    if isinstance(node, ast.Import):
                        for alias in node.names:
                            imports.append(alias.name)
                    elif isinstance(node, ast.ImportFrom):
                        if node.module:
                            imports.append(node.module)
                
                # Detect frameworks and libraries from imports
                framework_indicators = {
                    'django': ['django', 'rest_framework'],
                    'flask': ['flask'],
                    'fastapi': ['fastapi', 'uvicorn'],
                    'streamlit': ['streamlit'],
                    'pytorch': ['torch', 'torchvision'],
                    'tensorflow': ['tensorflow', 'keras'],
                    'scikit-learn': ['sklearn'],
                    'opencv': ['cv2'],
                    'requests': ['requests'],
                    'sqlalchemy': ['sqlalchemy']
                }
                
                for framework, indicators in framework_indicators.items():
                    if any(any(indicator in imp for indicator in indicators) for imp in imports):
                        if framework not in self.analysis['frameworks']:
                            self.analysis['frameworks'].append(framework)
                
                # Extract classes and functions for functionality analysis
                classes = []
                functions = []
                
                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef):
                        classes.append({
                            'name': node.name,
                            'docstring': ast.get_docstring(node),
                            'methods': [n.name for n in node.body if isinstance(n, ast.FunctionDef)]
                        })
                    elif isinstance(node, ast.FunctionDef):
                        functions.append({
                            'name': node.name,
                            'docstring': ast.get_docstring(node),
                            'args': [arg.arg for arg in node.args.args]
                        })
                
                # Store file analysis
                rel_path = os.path.relpath(file_path, self.repo_path)
                self.analysis['file_analysis'][rel_path] = {
                    'type': 'python',
                    'imports': imports,
                    'classes': classes,
                    'functions': functions,
                    'lines': len(content.split('\n'))
                }
                
                # Detect API endpoints
                if any('app.route' in content or '@app.' in content or 'router.' in content for content in [content]):
                    self._extract_api_endpoints_python(content, rel_path)
                
                # Detect data models
                if any('class' in content and ('Model' in content or 'Schema' in content) for content in [content]):
                    self._extract_data_models_python(classes, rel_path)
                
            except SyntaxError:
                # File might have syntax errors, skip AST analysis
                pass
                
        except Exception as e:
            print(f"Error analyzing Python file {file_path}: {e}")
    
    def _analyze_javascript_file(self, file_path: str):
        """Analyze JavaScript files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Detect frameworks and patterns
            if 'import React' in content or 'from \'react\'' in content:
                if 'react' not in self.analysis['frameworks']:
                    self.analysis['frameworks'].append('react')
            
            if 'import Vue' in content or 'from \'vue\'' in content:
                if 'vue' not in self.analysis['frameworks']:
                    self.analysis['frameworks'].append('vue')
            
            if 'express()' in content or 'app.get(' in content:
                if 'express' not in self.analysis['frameworks']:
                    self.analysis['frameworks'].append('express')
            
            # Extract API endpoints
            self._extract_api_endpoints_js(content, os.path.relpath(file_path, self.repo_path))
            
        except Exception as e:
            print(f"Error analyzing JavaScript file {file_path}: {e}")
    
    def _analyze_typescript_file(self, file_path: str):
        """Analyze TypeScript files"""
        self._analyze_javascript_file(file_path)  # Similar analysis to JS
        if 'typescript' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('typescript')
    
    def _analyze_react_file(self, file_path: str):
        """Analyze React component files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'react' not in self.analysis['frameworks']:
                self.analysis['frameworks'].append('react')
            
            # Extract component information
            component_match = re.search(r'(?:export\s+default\s+)?(?:function|const)\s+(\w+)', content)
            if component_match:
                component_name = component_match.group(1)
                rel_path = os.path.relpath(file_path, self.repo_path)
                
                self.analysis['ui_components'].append({
                    'name': component_name,
                    'file': rel_path,
                    'type': 'react_component'
                })
                
        except Exception as e:
            print(f"Error analyzing React file {file_path}: {e}")
    
    def _analyze_java_file(self, file_path: str):
        """Analyze Java files"""
        if 'java' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('java')
    
    def _analyze_cpp_file(self, file_path: str):
        """Analyze C++ files"""
        if 'c++' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('c++')
    
    def _analyze_c_file(self, file_path: str):
        """Analyze C files"""
        if 'c' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('c')
    
    def _analyze_rust_file(self, file_path: str):
        """Analyze Rust files"""
        if 'rust' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('rust')
    
    def _analyze_go_file(self, file_path: str):
        """Analyze Go files"""
        if 'go' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('go')
    
    def _analyze_php_file(self, file_path: str):
        """Analyze PHP files"""
        if 'php' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('php')
    
    def _analyze_ruby_file(self, file_path: str):
        """Analyze Ruby files"""
        if 'ruby' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('ruby')
    
    def _analyze_swift_file(self, file_path: str):
        """Analyze Swift files"""
        if 'swift' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('swift')
    
    def _analyze_kotlin_file(self, file_path: str):
        """Analyze Kotlin files"""
        if 'kotlin' not in self.analysis['main_technologies']:
            self.analysis['main_technologies'].append('kotlin')
    
    def _analyze_configuration(self):
        """Analyze configuration files"""
        config_files = [
            'docker-compose.yml', 'Dockerfile', '.env', '.env.example',
            'vercel.json', 'netlify.toml', 'next.config.js', 'nuxt.config.js',
            'webpack.config.js', 'vite.config.js', 'tailwind.config.js',
            'tsconfig.json', 'babel.config.js', '.eslintrc', 'prettier.config.js'
        ]
        
        for config_file in config_files:
            file_path = os.path.join(self.repo_path, config_file)
            if os.path.exists(file_path):
                self.analysis['config_files'].append(config_file)
                
                # Detect deployment targets
                if config_file in ['vercel.json']:
                    self.analysis['deployment_targets'].append('vercel')
                elif config_file in ['netlify.toml']:
                    self.analysis['deployment_targets'].append('netlify')
                elif config_file in ['Dockerfile', 'docker-compose.yml']:
                    self.analysis['deployment_targets'].append('docker')
                
                # Extract environment variables
                if config_file in ['.env.example', '.env']:
                    self._extract_env_variables(file_path)
    
    def _extract_env_variables(self, file_path: str):
        """Extract environment variables from .env files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            for line in lines:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    var_name = line.split('=')[0].strip()
                    self.analysis['environment_variables'].append(var_name)
                    
                    # Detect external services from env vars
                    service_indicators = {
                        'openai': ['OPENAI_API_KEY', 'OPENAI_'],
                        'google': ['GOOGLE_API_KEY', 'GOOGLE_', 'GEMINI_'],
                        'aws': ['AWS_ACCESS_KEY', 'AWS_SECRET', 'AWS_'],
                        'stripe': ['STRIPE_SECRET', 'STRIPE_PUBLIC'],
                        'github': ['GITHUB_CLIENT_ID', 'GITHUB_TOKEN'],
                        'database': ['DATABASE_URL', 'DB_HOST', 'MONGO_URI'],
                        'redis': ['REDIS_URL', 'REDIS_HOST'],
                        'email': ['SMTP_', 'EMAIL_', 'SENDGRID_']
                    }
                    
                    for service, indicators in service_indicators.items():
                        if any(indicator in var_name for indicator in indicators):
                            if service not in self.analysis['external_services']:
                                self.analysis['external_services'].append(service)
                                
        except Exception as e:
            print(f"Error extracting env variables: {e}")
    
    def _analyze_documentation(self):
        """Analyze existing documentation"""
        doc_files = ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE', 'docs/', 'documentation/']
        
        for doc_file in doc_files:
            file_path = os.path.join(self.repo_path, doc_file)
            if os.path.exists(file_path):
                self.analysis['documentation_files'].append(doc_file)
    
    def _detect_project_type(self):
        """Detect the primary project type based on all analysis"""
        if not self.analysis['project_type']:
            # Fallback detection based on technologies
            if any(fw in self.analysis['frameworks'] for fw in ['react', 'vue', 'angular', 'svelte']):
                self.analysis['project_type'] = 'web_app'
            elif any(fw in self.analysis['frameworks'] for fw in ['django', 'flask', 'fastapi', 'express']):
                self.analysis['project_type'] = 'api'
            elif any(fw in self.analysis['frameworks'] for fw in ['pytorch', 'tensorflow', 'scikit-learn']):
                self.analysis['project_type'] = 'ml_project'
            elif 'electron' in self.analysis['frameworks']:
                self.analysis['project_type'] = 'desktop'
            elif 'react-native' in self.analysis['frameworks']:
                self.analysis['project_type'] = 'mobile'
            else:
                self.analysis['project_type'] = 'library'
    
    def _analyze_architecture_patterns(self):
        """Detect architectural patterns"""
        patterns = []
        
        # MVC pattern
        if any('models' in path.lower() for path in self.analysis['file_analysis'].keys()) and \
           any('views' in path.lower() or 'controllers' in path.lower() for path in self.analysis['file_analysis'].keys()):
            patterns.append('MVC')
        
        # Microservices
        if 'docker-compose.yml' in self.analysis['config_files'] or \
           any('service' in path.lower() for path in self.analysis['file_analysis'].keys()):
            patterns.append('Microservices')
        
        # REST API
        if self.analysis['api_endpoints']:
            patterns.append('REST API')
        
        # Component-based (React/Vue)
        if any(fw in self.analysis['frameworks'] for fw in ['react', 'vue', 'angular']):
            patterns.append('Component-based Architecture')
        
        self.analysis['architecture_patterns'] = patterns
    
    def _extract_actual_functionality(self):
        """Extract actual functionality from code analysis"""
        functionality = []
        
        # Based on frameworks
        if 'django' in self.analysis['frameworks']:
            functionality.append('Web application with Django framework')
        if 'fastapi' in self.analysis['frameworks']:
            functionality.append('High-performance API with FastAPI')
        if 'react' in self.analysis['frameworks']:
            functionality.append('Interactive user interface with React')
        if 'pytorch' in self.analysis['frameworks']:
            functionality.append('Machine learning with PyTorch')
        
        # Based on file analysis
        for file_path, analysis in self.analysis['file_analysis'].items():
            if analysis['type'] == 'python':
                for func in analysis['functions']:
                    if func['name'] in ['train', 'predict', 'model']:
                        functionality.append('Machine learning model training and prediction')
                        break
                for cls in analysis['classes']:
                    if 'Model' in cls['name']:
                        functionality.append('Data modeling and database operations')
                        break
        
        # Based on API endpoints
        if self.analysis['api_endpoints']:
            functionality.append(f"RESTful API with {len(self.analysis['api_endpoints'])} endpoints")
        
        # Based on external services
        if 'openai' in self.analysis['external_services']:
            functionality.append('AI-powered features using OpenAI')
        if 'stripe' in self.analysis['external_services']:
            functionality.append('Payment processing with Stripe')
        if 'database' in self.analysis['external_services']:
            functionality.append('Data persistence and management')
        
        self.analysis['actual_functionality'] = functionality
    
    def _extract_api_endpoints_python(self, content: str, file_path: str):
        """Extract API endpoints from Python files"""
        # Flask routes
        flask_routes = re.findall(r'@app\.route\([\'"]([^\'"]+)[\'"](?:,\s*methods=\[([^\]]+)\])?\)', content)
        for route, methods in flask_routes:
            self.analysis['api_endpoints'].append({
                'path': route,
                'methods': methods.replace("'", "").replace('"', '').split(', ') if methods else ['GET'],
                'file': file_path,
                'framework': 'flask'
            })
        
        # FastAPI routes
        fastapi_routes = re.findall(r'@app\.(get|post|put|delete|patch)\([\'"]([^\'"]+)[\'"]', content)
        for method, route in fastapi_routes:
            self.analysis['api_endpoints'].append({
                'path': route,
                'methods': [method.upper()],
                'file': file_path,
                'framework': 'fastapi'
            })
    
    def _extract_api_endpoints_js(self, content: str, file_path: str):
        """Extract API endpoints from JavaScript files"""
        # Express routes
        express_routes = re.findall(r'app\.(get|post|put|delete|patch)\([\'"]([^\'"]+)[\'"]', content)
        for method, route in express_routes:
            self.analysis['api_endpoints'].append({
                'path': route,
                'methods': [method.upper()],
                'file': file_path,
                'framework': 'express'
            })
    
    def _extract_data_models_python(self, classes: List[Dict], file_path: str):
        """Extract data models from Python classes"""
        for cls in classes:
            if any(keyword in cls['name'] for keyword in ['Model', 'Schema', 'Entity']):
                self.analysis['data_models'].append({
                    'name': cls['name'],
                    'file': file_path,
                    'methods': cls['methods'],
                    'docstring': cls['docstring']
                })
    
    def _calculate_metrics(self):
        """Calculate code metrics"""
        total_files = len(self.analysis['file_analysis'])
        total_lines = sum(analysis.get('lines', 0) for analysis in self.analysis['file_analysis'].values())
        
        self.analysis['code_metrics'] = {
            'total_files': total_files,
            'total_lines': total_lines,
            'average_file_size': total_lines // total_files if total_files > 0 else 0,
            'languages': list(set(analysis['type'] for analysis in self.analysis['file_analysis'].values())),
            'complexity_score': self._calculate_complexity_score()
        }
    
    def _calculate_complexity_score(self) -> str:
        """Calculate project complexity score"""
        score = 0
        
        # Based on number of technologies
        score += len(self.analysis['main_technologies']) * 2
        score += len(self.analysis['frameworks']) * 3
        score += len(self.analysis['databases']) * 2
        score += len(self.analysis['external_services']) * 1
        
        # Based on file count and size
        if self.analysis['code_metrics'].get('total_files', 0) > 50:
            score += 5
        elif self.analysis['code_metrics'].get('total_files', 0) > 20:
            score += 3
        
        if score < 10:
            return 'Simple'
        elif score < 20:
            return 'Moderate'
        elif score < 35:
            return 'Complex'
        else:
            return 'Highly Complex'


def enhance_analysis_context(repo_path: str) -> Dict[str, Any]:
    """
    Enhanced analysis function that provides comprehensive project understanding
    """
    analyzer = DeepProjectAnalyzer(repo_path)
    deep_analysis = analyzer.analyze_project()
    
    # Create enhanced context for AI
    enhanced_context = {
        'project_overview': {
            'type': deep_analysis['project_type'],
            'complexity': deep_analysis['code_metrics'].get('complexity_score', 'Unknown'),
            'primary_languages': deep_analysis['main_technologies'],
            'main_frameworks': deep_analysis['frameworks'][:3],  # Top 3
            'architecture_patterns': deep_analysis['architecture_patterns']
        },
        'technical_stack': {
            'frontend': [fw for fw in deep_analysis['frameworks'] if fw in ['react', 'vue', 'angular', 'svelte']],
            'backend': [fw for fw in deep_analysis['frameworks'] if fw in ['django', 'flask', 'fastapi', 'express', 'nest']],
            'databases': deep_analysis['databases'],
            'deployment': deep_analysis['deployment_targets'],
            'testing': deep_analysis['testing_frameworks'],
            'build_tools': deep_analysis['build_tools']
        },
        'functionality': {
            'actual_features': deep_analysis['actual_functionality'],
            'api_endpoints': deep_analysis['api_endpoints'][:5],  # First 5
            'data_models': [model['name'] for model in deep_analysis['data_models'][:5]],
            'ui_components': [comp['name'] for comp in deep_analysis['ui_components'][:5]],
            'external_integrations': deep_analysis['external_services']
        },
        'project_structure': {
            'entry_points': deep_analysis['entry_points'],
            'config_files': deep_analysis['config_files'],
            'documentation': deep_analysis['documentation_files'],
            'scripts': deep_analysis['scripts'][:5]  # First 5
        },
        'environment': {
            'required_variables': deep_analysis['environment_variables'][:10],  # First 10
            'package_managers': deep_analysis['package_managers'],
            'dependencies_summary': deep_analysis['dependency_analysis']
        },
        'metrics': deep_analysis['code_metrics'],
        'raw_analysis': deep_analysis  # Full analysis for reference
    }
    
    return enhanced_context