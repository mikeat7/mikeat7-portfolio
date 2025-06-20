import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, Settings, Copy, ExternalLink } from 'lucide-react';
import { TavusReplicaChecker, ReplicaInfo, ReplicaCheckResult } from '../utils/tavusReplicaCheck';
import { tavusConfig } from '../config/config';

const TavusDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replicaCheck, setReplicaCheck] = useState<ReplicaCheckResult | null>(null);
  const [availableReplicas, setAvailableReplicas] = useState<ReplicaInfo[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const runValidation = async () => {
    setLoading(true);
    try {
      const result = await TavusReplicaChecker.validateAndDebug();
      setReplicaCheck(result.currentReplica);
      setAvailableReplicas(result.availableReplicas);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !replicaCheck) {
      runValidation();
    }
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (isValid: boolean, loading: boolean) => {
    if (loading) return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
    return isValid ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Tavus Debug Panel"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tavus API Debug Panel</h2>
                  <p className="text-sm text-gray-600">Replica validation and troubleshooting</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Current Configuration */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Current Configuration
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-600">API Key:</label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-white px-2 py-1 rounded border">
                        {tavusConfig.apiKey ? `${tavusConfig.apiKey.substring(0, 8)}...` : 'Not configured'}
                      </code>
                      {tavusConfig.apiKey && (
                        <button
                          onClick={() => copyToClipboard(tavusConfig.apiKey)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Copy API key"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Replica ID:</label>
                    <div className="flex items-center space-x-2">
                      <code className="bg-white px-2 py-1 rounded border">
                        {tavusConfig.replicaId || 'Not configured'}
                      </code>
                      {tavusConfig.replicaId && (
                        <button
                          onClick={() => copyToClipboard(tavusConfig.replicaId)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Copy replica ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Callback URL:</label>
                    <code className="bg-white px-2 py-1 rounded border text-xs">
                      {tavusConfig.callbackUrl || 'Not configured'}
                    </code>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Recording:</label>
                    <code className="bg-white px-2 py-1 rounded border">
                      {tavusConfig.enableRecording ? 'Enabled' : 'Disabled'}
                    </code>
                  </div>
                </div>
              </div>

              {/* Validation Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Replica Validation</h3>
                  <button
                    onClick={runValidation}
                    disabled={loading}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Validate</span>
                  </button>
                </div>

                {replicaCheck && (
                  <div className={`p-4 rounded-lg border-l-4 ${
                    replicaCheck.isValid 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(replicaCheck.isValid, loading)}
                      <span className={`font-medium ${
                        replicaCheck.isValid ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {replicaCheck.isValid ? 'Replica Valid' : 'Replica Invalid'}
                      </span>
                    </div>
                    
                    {replicaCheck.error && (
                      <p className="text-red-600 text-sm mb-2">{replicaCheck.error}</p>
                    )}
                    
                    {replicaCheck.replica && (
                      <div className="bg-white rounded p-3 mt-2">
                        <h4 className="font-medium text-gray-800 mb-2">Replica Details:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><strong>Name:</strong> {replicaCheck.replica.name}</div>
                          <div><strong>Status:</strong> {replicaCheck.replica.status}</div>
                          <div><strong>Created:</strong> {new Date(replicaCheck.replica.created_at).toLocaleDateString()}</div>
                          <div><strong>Updated:</strong> {new Date(replicaCheck.replica.updated_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Available Replicas */}
              {availableReplicas.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Available Replicas</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableReplicas.map((replica) => (
                      <div
                        key={replica.replica_id}
                        className={`p-3 rounded-lg border ${
                          replica.replica_id === tavusConfig.replicaId
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">{replica.name}</div>
                            <div className="text-sm text-gray-600">
                              {replica.replica_id} • {replica.status}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {replica.replica_id === tavusConfig.replicaId && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Current
                              </span>
                            )}
                            <button
                              onClick={() => copyToClipboard(replica.replica_id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Copy replica ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                    Recommendations
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <ul className="space-y-1 text-sm">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://app.tavus.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Tavus Dashboard</span>
                  </a>
                  <a
                    href="https://docs.tavus.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>API Docs</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify({
                      apiKey: tavusConfig.apiKey ? `${tavusConfig.apiKey.substring(0, 8)}...` : 'Not configured',
                      replicaId: tavusConfig.replicaId,
                      callbackUrl: tavusConfig.callbackUrl,
                      validation: replicaCheck
                    }, null, 2))}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Debug Info</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TavusDebugPanel;