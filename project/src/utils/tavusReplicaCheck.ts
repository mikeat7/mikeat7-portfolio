import { tavusConfig } from '../config/config';

export interface ReplicaInfo {
  replica_id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  voice_id?: string;
}

export interface ReplicaCheckResult {
  isValid: boolean;
  replica?: ReplicaInfo;
  error?: string;
  statusCode?: number;
}

export class TavusReplicaChecker {
  /**
   * Check if a replica ID exists and is valid
   */
  static async checkReplica(replicaId?: string): Promise<ReplicaCheckResult> {
    const targetReplicaId = replicaId || tavusConfig.replicaId;
    
    if (!targetReplicaId) {
      return {
        isValid: false,
        error: 'No replica ID provided'
      };
    }

    if (!tavusConfig.apiKey) {
      return {
        isValid: false,
        error: 'Tavus API key not configured'
      };
    }

    try {
      console.log(`🔍 Checking Tavus replica: ${targetReplicaId}`);
      
      const response = await fetch(`https://api.tavus.io/v1/replicas/${targetReplicaId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tavusConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`📡 Replica check response: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const replicaData = await response.json();
        console.log('✅ Replica found:', replicaData);
        
        return {
          isValid: true,
          replica: replicaData,
          statusCode: response.status
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Replica check failed:', response.status, errorData);
        
        let errorMessage = '';
        switch (response.status) {
          case 404:
            errorMessage = `Replica ID "${targetReplicaId}" not found. Please check your replica ID.`;
            break;
          case 401:
            errorMessage = 'Invalid API key. Please check your Tavus API key.';
            break;
          case 403:
            errorMessage = 'Access forbidden. Please verify your API key permissions.';
            break;
          case 429:
            errorMessage = 'Rate limit exceeded. Please try again later.';
            break;
          case 500:
            errorMessage = 'Tavus server error. Please try again later.';
            break;
          default:
            errorMessage = `API error: ${response.status} ${response.statusText}`;
        }
        
        return {
          isValid: false,
          error: errorMessage,
          statusCode: response.status
        };
      }
    } catch (error) {
      console.error('❌ Network error checking replica:', error);
      return {
        isValid: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * List all available replicas for your account
   */
  static async listReplicas(): Promise<{ replicas: ReplicaInfo[]; error?: string }> {
    if (!tavusConfig.apiKey) {
      return {
        replicas: [],
        error: 'Tavus API key not configured'
      };
    }

    try {
      console.log('📋 Fetching all available replicas...');
      
      const response = await fetch('https://api.tavus.io/v1/replicas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tavusConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Replicas fetched:', data);
        return { replicas: data.replicas || [] };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to fetch replicas:', response.status, errorData);
        return {
          replicas: [],
          error: `Failed to fetch replicas: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('❌ Network error fetching replicas:', error);
      return {
        replicas: [],
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get detailed information about the current configured replica
   */
  static async getCurrentReplicaInfo(): Promise<ReplicaCheckResult> {
    return this.checkReplica();
  }

  /**
   * Validate replica and provide helpful debugging info
   */
  static async validateAndDebug(): Promise<{
    currentReplica: ReplicaCheckResult;
    availableReplicas: ReplicaInfo[];
    recommendations: string[];
  }> {
    console.log('🔧 Running Tavus replica validation and debug...');
    
    const [currentResult, replicasResult] = await Promise.all([
      this.getCurrentReplicaInfo(),
      this.listReplicas()
    ]);

    const recommendations: string[] = [];

    if (!currentResult.isValid) {
      recommendations.push('❌ Current replica ID is invalid or not found');
      
      if (replicasResult.replicas.length > 0) {
        recommendations.push('✅ Available replicas found - consider using one of these:');
        replicasResult.replicas.forEach(replica => {
          recommendations.push(`   • ${replica.replica_id} - ${replica.name} (${replica.status})`);
        });
      } else {
        recommendations.push('⚠️ No replicas found in your account');
        recommendations.push('💡 Create a replica first at https://app.tavus.io');
      }
    } else {
      recommendations.push('✅ Current replica ID is valid and ready to use');
    }

    return {
      currentReplica: currentResult,
      availableReplicas: replicasResult.replicas,
      recommendations
    };
  }
}

// Convenience functions for quick checks
export const checkCurrentReplica = () => TavusReplicaChecker.getCurrentReplicaInfo();
export const listAllReplicas = () => TavusReplicaChecker.listReplicas();
export const validateReplica = () => TavusReplicaChecker.validateAndDebug();