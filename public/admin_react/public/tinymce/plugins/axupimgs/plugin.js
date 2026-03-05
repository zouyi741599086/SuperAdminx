tinymce.PluginManager.add('axupimgs', function(editor, url) {
	var pluginName='多图片上传';
	window.axupimgs={}; // 扔外部公共变量，也可以扔一个自定义的位置

	var baseURL = tinymce.baseURL;
	var iframe1 = `${baseURL}/plugins/axupimgs/upfiles.html`;
    axupimgs.images_upload_handler = editor.getParam('images_upload_imgs', undefined, 'function');
    axupimgs.images_upload_base_path = editor.getParam('images_upload_base_path', '', 'string');
    axupimgs.axupimgs_filetype = editor.getParam('axupimgs_filetype', '.png,.gif,.jpg,.jpeg', 'string');
	axupimgs.res=[];
	var openDialog = function() {
		return editor.windowManager.openUrl({
			title: pluginName,
			size: 'large',
			url:iframe1,
			buttons: [
				{
					type: 'cancel',
					text: 'Close'
				},
				{
					type: 'custom',
					text: 'Save',
					name: 'save',
					primary: true
				},
			],
			onAction: function (api, details) {
				switch (details.name) {
					case 'save':
						var html = '';
						var imgs = axupimgs.res;
						var len = imgs.length;
						for(let i=0;i<len;i++){
							if( imgs[i].url ){
								html += '<img src="'+imgs[i].url+'" />';
							}
						}
						editor.insertContent(html);
						axupimgs.res=[];
						api.close();
						break;
					default:
						break;
				}
				
			}
		});
	};

	editor.ui.registry.getAll().icons.axupimgs || editor.ui.registry.addIcon('axupimgs','<svg t="1770272751398" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5077" width="19" height="19"><path d="M870.240093 845.924561V267.982758A114.410977 114.410977 0 0 0 755.829116 153.571781H114.410977A114.410977 114.410977 0 0 0 0 267.982758v641.41814a97.262128 97.262128 0 0 0 1.279765 13.565507A114.155024 114.155024 0 0 0 114.410977 1023.811875h641.418139a62.96443 62.96443 0 0 0 9.726213 0A113.899071 113.899071 0 0 0 870.240093 909.400898v-9.214307a294.601867 294.601867 0 0 0 0-54.26203zM114.410977 217.560023h641.418139a51.190594 51.190594 0 0 1 51.190594 51.190594V435.120047A303.304268 303.304268 0 0 0 460.715344 546.715541a234.196966 234.196966 0 0 1-153.571782 95.72641 228.821954 228.821954 0 0 1-243.15532-110.827635v-263.631558A51.190594 51.190594 0 0 1 114.410977 217.560023zM230.357672 353.982956a63.988242 63.988242 0 1 0 63.988242 63.988242 63.988242 63.988242 0 0 0-63.988242-63.988242z m793.454203-239.571979v641.418139A114.155024 114.155024 0 0 1 921.430687 870.240093v-66.035866L918.871157 255.952969c0-96.494269-43.767958-153.571781-153.571781-153.571782H154.851546a114.155024 114.155024 0 0 1 113.131212-102.381187h641.41814A114.410977 114.410977 0 0 1 1023.811875 114.410977z" p-id="5078"></path></svg>');
	
	editor.ui.registry.addButton('axupimgs', {
		icon: 'axupimgs',
        tooltip: pluginName,
        onAction: function () {
			openDialog();
		}
	});
	editor.ui.registry.addMenuItem('axupimgs', {
		icon: 'axupimgs',
		text: '图片批量上传...',
		onAction: function() {
			openDialog();
		}
	});
	return {
		getMetadata: function() {
			return  {
				name: pluginName,
				url: "http://tinymce.ax-z.cn/more-plugins/axupimgs.php",
			};
		}
	};
});
