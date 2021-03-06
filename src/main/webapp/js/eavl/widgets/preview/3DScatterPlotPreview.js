/**
 * Previewer for rendering 3D Scatter Plots
 */
Ext.define('eavl.widgets.preview.3DScatterPlotPreview', {
    extend : 'Ext.container.Container',

    innerId : null,
    threeJs : null,
    d3 : null,

    constructor : function(config) {
        this.innerId = Ext.id();
        this._md = {};
        Ext.apply(config,{
            layout : 'fit',
            items : [{
                xtype : 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items : [{
                    xtype: 'panel',
                    width: 150,
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    itemId: 'details',
                    items: [{
                        xtype: 'label',
                        margin: '50 0 0 0',
                        style: {
                            color: '#888888',
                            'font-style': 'italic',
                            'font-size': '14.5px'
                        },
                        text: 'Click a point'
                    },{
                        xtype: 'label',
                        margin: '2 0 0 0',
                        style: {
                            color: '#888888',
                            'font-style': 'italic',
                            'font-size': '14.5px'
                        },
                        text: 'for more information'
                    }]
                },{
                    xtype : '3dscatterplot',
                    itemId : 'plot',
                    valueAttr : 'estimate',
                    valueScale : 'log',
                    pointSize: 4,
                    allowSelection : true,
                    flex: 1,
                    listeners: {
                        select: function(plot, data) {
                            var parent = plot.ownerCt.down('#details');

                            if (parent.items.getCount() !== 0) {
                                parent.removeAll(true);
                            }

                            parent.add({
                                xtype: 'datadisplayfield',
                                fieldLabel: plot.xLabel,
                                margin : '10 0 0 0',
                                value: data.x
                            });
                            parent.add({
                                xtype: 'datadisplayfield',
                                fieldLabel: plot.yLabel,
                                margin : '10 0 0 0',
                                value: data.y
                            });
                            parent.add({
                                xtype: 'datadisplayfield',
                                fieldLabel: plot.zLabel,
                                margin : '10 0 0 0',
                                value: data.z
                            });
                            parent.add({
                                xtype: 'datadisplayfield',
                                fieldLabel: 'Estimate',
                                margin : '10 0 0 0',
                                value: data.estimate
                            });
                        },
                        deselect: function(plot) {
                            var parent = plot.ownerCt.down('#details');

                            parent.removeAll(true);
                            parent.add({
                                xtype: 'label',
                                margin: '50 0 0 0',
                                style: {
                                    color: '#888888',
                                    'font-style': 'italic',
                                    'font-size': '14.5px'
                                },
                                text: 'Click a point'
                            });
                            parent.add({
                                xtype: 'label',
                                margin: '2 0 0 0',
                                style: {
                                    color: '#888888',
                                    'font-style': 'italic',
                                    'font-size': '14.5px'
                                },
                                text: 'for more information'
                            });
                        }
                    }
                }]
            }]
        });

        this.callParent(arguments);
    },

    /**
     * function(job, fileName) job - EAVLJob - Job to preview
     * fileName - String - name of the job file to preview
     *
     * Setup this preview page to preview the specified file for
     * the specified job
     *
     * returns nothing
     */
    preview : function(job, fileName) {
        var me = this;
        var mask = new Ext.LoadMask(me, {
            msg : "Please wait..."
        });
        mask.show();
        Ext.Ajax.request({
            url : 'results/getKDEGeometry.do',
            params : {
                jobId : job.get('id'),
                name : fileName
            },
            scope : this,
            callback : function(options, success, response) {
                mask.hide();
                mask.destroy();
                if (!success) {
                    return;
                }

                var responseObj = Ext.JSON.decode(response.responseText);
                if (!responseObj || !responseObj.success) {
                    return;
                }

                var scatterPlot = this.down('#plot');

                scatterPlot.xLabel = responseObj.data.xLabel;
                scatterPlot.yLabel = responseObj.data.yLabel;
                scatterPlot.zLabel = responseObj.data.zLabel;
                scatterPlot.plot(responseObj.data.points);
            }
        });
    }
});